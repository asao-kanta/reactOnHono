import type { Context, Next } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { AuthorizationCode } from "simple-oauth2";

// AWS SDK for Secrets Manager
import {
	GetSecretValueCommand,
	SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

// セッションベース認証用の型定義
interface UserInfo {
	id: string;
	name: string;
	email: string;
}

interface SessionData {
	user: UserInfo;
	tokens: {
		access_token: string;
		expires_at?: string;
	};
}

// Entra ID認証情報の型定義
interface EntraIdCredentials {
	tenantId: string;
	clientId: string;
	clientSecret: string;
}

// Secrets Managerクライアント
const secretsClient = new SecretsManagerClient({
	region: process.env.AWS_REGION || "ap-northeast-1",
});

// Entra ID認証情報を取得（セキュリティ優先：毎回取得）
async function getEntraIdCredentials(): Promise<EntraIdCredentials> {
	// 開発環境では環境変数から取得
	if (process.env.NODE_ENV === "development") {
		console.log("🔧 Loading Entra ID credentials from environment variables");
		return {
			tenantId: process.env.ENTRA_TENANT_ID || "",
			clientId: process.env.ENTRA_CLIENT_ID || "",
			clientSecret: process.env.ENTRA_CLIENT_SECRET || "",
		};
	}

	// 本番環境では毎回Secrets Managerから取得（セキュリティ優先）
	const secretArn = process.env.ENTRA_SECRET_ARN;
	if (!secretArn) {
		throw new Error("ENTRA_SECRET_ARN environment variable is not set");
	}

	try {
		console.log("🔐 Fetching Entra ID credentials from Secrets Manager");
		const startTime = Date.now();
		
		const command = new GetSecretValueCommand({
			SecretId: secretArn,
		});

		const response = await secretsClient.send(command);
		const secretString = response.SecretString;

		if (!secretString) {
			throw new Error("Secret value is empty");
		}

		const credentials = JSON.parse(secretString) as EntraIdCredentials;
		const fetchTime = Date.now() - startTime;

		console.log(`✅ Entra ID credentials loaded from Secrets Manager (${fetchTime}ms)`);
		return credentials;
	} catch (error) {
		console.error(
			"❌ Failed to load Entra ID credentials from Secrets Manager:",
			error,
		);
		throw new Error("Failed to load authentication credentials");
	}
}

// OAuth2 設定（動的に取得）
async function createOAuth2Config() {
	const credentials = await getEntraIdCredentials();

	return {
		client: {
			id: credentials.clientId,
			secret: credentials.clientSecret,
		},
		auth: {
			tokenHost: "https://login.microsoftonline.com",
			tokenPath: `/${credentials.tenantId}/oauth2/v2.0/token`,
			authorizePath: `/${credentials.tenantId}/oauth2/v2.0/authorize`,
		},
	};
}

// OAuth2 Client作成関数
async function createOAuth2Client() {
	const config = await createOAuth2Config();
	return new AuthorizationCode(config);
}

// JWKS Client for Entra ID
let jwksClientInstance: jwksClient.JwksClient | null = null;

function getJwksClient(tenantId: string) {
	if (!jwksClientInstance) {
		jwksClientInstance = jwksClient({
			jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
			requestHeaders: {},
			timeout: 30000,
		});
	}
	return jwksClientInstance;
}

// 公開鍵を取得してJWT検証
async function getSigningKey(
	header: jwt.JwtHeader,
	tenantId: string,
): Promise<string> {
	const client = getJwksClient(tenantId);
	const key = await client.getSigningKey(header.kid);
	return key.getPublicKey();
}

// JWT検証関数
async function verifyEntraIdToken(
	token: string,
	tenantId: string,
	clientId: string,
): Promise<any> {
	return new Promise((resolve, reject) => {
		jwt.verify(
			token,
			async (header, callback) => {
				try {
					const signingKey = await getSigningKey(header, tenantId);
					callback(null, signingKey);
				} catch (error) {
					callback(error as Error);
				}
			},
			{
				// User.Readスコープの場合、audienceはMicrosoft Graph API
				audience: ["https://graph.microsoft.com", clientId],
				issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`, // iss クレーム検証
				algorithms: ["RS256"], // RS256 アルゴリズムのみ許可
			},
			(error, decoded) => {
				if (error) {
					reject(error);
				} else {
					resolve(decoded);
				}
			},
		);
	});
}

// セッション取得ヘルパー
function getSessionData(c: Context): SessionData | null {
	const sessionCookie = getCookie(c, "auth_session");
	if (!sessionCookie) return null;

	try {
		const sessionData = JSON.parse(sessionCookie) as SessionData;

		// トークンの有効期限チェック
		if (
			sessionData.tokens.expires_at &&
			new Date() > new Date(sessionData.tokens.expires_at)
		) {
			deleteCookie(c, "auth_session");
			return null;
		}

		return sessionData;
	} catch (error) {
		deleteCookie(c, "auth_session");
		return null;
	}
}

// セッションベース認証ミドルウェア
export const sessionAuthMiddleware = async (c: Context, next: Next) => {
	const sessionData = getSessionData(c);

	if (!sessionData) {
		console.log("❌ No valid session found");
		throw new HTTPException(401, { message: "Authentication required" });
	}

	console.log("✅ Session authenticated:", sessionData.user.name);

	// ユーザー情報をコンテキストに設定
	c.set("user", sessionData.user);
	c.set("session", sessionData);

	await next();
};

// Entra ID JWT認証ミドルウェア
export const entraIdAuthMiddleware = async (c: Context, next: Next) => {
	const authHeader = c.req.header("Authorization");

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		console.log("❌ Missing or invalid Bearer token format");
		throw new HTTPException(401, { message: "Bearer token required" });
	}

	const token = authHeader.substring(7);

	try {
		console.log("🔍 Verifying Entra ID JWT token...");

		const credentials = await getEntraIdCredentials();
		const decoded = await verifyEntraIdToken(
			token,
			credentials.tenantId,
			credentials.clientId,
		);

		console.log("✅ Entra ID JWT token verified successfully");
		console.log(
			`👤 User: ${decoded.name || decoded.preferred_username || decoded.sub}`,
		);

		// ユーザー情報をコンテキストに設定
		c.set("user", decoded);

		await next();
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		console.log("❌ Entra ID JWT verification failed:", errorMessage);
		throw new HTTPException(401, { message: "Invalid or expired token" });
	}
};

// OAuth2認証フロー用のヘルパー関数
export const createAuthFlowHandlers = () => {
	return {
		// ログイン開始
		startLogin: async (c: Context) => {
			const client = await createOAuth2Client();
			
			// API Gateway URLの正しい構築（/prodステージを含む）
			const url = new URL(c.req.url);
			const host = url.host;
			const protocol = url.protocol;
			
			const redirectUri = `${protocol}//${host}/prod/auth/callback`;

			const authorizationUri = client.authorizeURL({
				redirect_uri: redirectUri,
				scope: "openid profile email User.Read",
				state: crypto.randomUUID(), // CSRF保護
			});

			console.log("🔐 Starting Entra ID login flow");
			console.log("📍 Redirect URI:", redirectUri);
			return c.redirect(authorizationUri);
		},

		// コールバック処理
		handleCallback: async (c: Context) => {
			try {
				const code = c.req.query("code");

				if (!code) {
					throw new Error("No authorization code received");
				}

				console.log("🔍 Processing Entra ID callback");

				const client = await createOAuth2Client();
				
				// API Gateway URLの正しい構築（/prodステージを含む）
				const url = new URL(c.req.url);
				const host = url.host;
				const protocol = url.protocol;

				const redirectUri = `${protocol}//${host}/prod/auth/callback`;

				console.log("📍 Using redirect URI:", redirectUri);

				// トークン交換
				const accessToken = await client.getToken({
					code: code,
					redirect_uri: redirectUri,
				});

				// ユーザー情報取得
				const userResponse = await fetch(
					"https://graph.microsoft.com/v1.0/me",
					{
						headers: {
							Authorization: `Bearer ${accessToken.token.access_token}`,
						},
					},
				);

				if (!userResponse.ok) {
					throw new Error("Failed to fetch user info");
				}

				const userInfo = (await userResponse.json()) as any;

				console.log(
					"✅ User authenticated:",
					userInfo.displayName || userInfo.userPrincipalName,
				);

				// セッション情報をCookieに保存
				const sessionData: SessionData = {
					user: {
						id: userInfo.id,
						name: userInfo.displayName,
						email: userInfo.userPrincipalName,
					},
					tokens: {
						access_token: accessToken.token.access_token as string,
						expires_at: accessToken.token.expires_at as string | undefined,
					},
				};

				// セッションCookieを設定
				setCookie(c, "auth_session", JSON.stringify(sessionData), {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "Lax",
					maxAge: 3600, // 1時間
				});

				// フロントエンドのルートにリダイレクト（/prodステージを含む）
				return c.redirect("/prod/");
			} catch (error) {
				console.error("❌ Authentication error:", error);
				return c.redirect("/prod/?auth_error=true");
			}
		},

		// ログアウト
		logout: async (c: Context) => {
			deleteCookie(c, "auth_session");
			console.log("👋 User logged out");
			return c.json({ success: true });
		},

		// 認証状態確認
		getCurrentUser: async (c: Context) => {
			const sessionData = getSessionData(c);

			if (!sessionData) {
				return c.json({ authenticated: false }, 401);
			}

			return c.json({
				authenticated: true,
				user: sessionData.user,
			});
		},
	};
};

// セッション取得ヘルパーのエクスポート
export { getSessionData };

// フロントエンド認証管理（将来のEntra ID統合準備）

export interface User {
	id: string;
	name: string;
	email: string;
	roles?: string[];
}

export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	token: string | null;
}

// 認証プロバイダー抽象化
export interface AuthProvider {
	login(): Promise<AuthState>;
	logout(): Promise<void>;
	getToken(): Promise<string | null>;
	refreshToken(): Promise<string | null>;
}

// Entra ID認証プロバイダー（将来の実装）
export class EntraIdAuthProvider implements AuthProvider {
	private _tenantId: string;
	private _clientId: string;

	constructor(tenantId: string, clientId: string) {
		this._tenantId = tenantId;
		this._clientId = clientId;

		// 将来の実装で使用予定のため、TypeScriptの未使用変数警告を回避
		void this._tenantId;
		void this._clientId;
	}

	async login(): Promise<AuthState> {
		// TODO: Entra ID認証実装
		// 1. Microsoft Graph API認証
		// 2. JWTトークン取得
		// 3. ユーザー情報取得
		throw new Error("Entra ID authentication not implemented yet");
	}

	async logout(): Promise<void> {
		// TODO: Entra IDからのログアウト
		throw new Error("Entra ID logout not implemented yet");
	}

	async getToken(): Promise<string | null> {
		// TODO: JWTトークン取得
		throw new Error("Entra ID token retrieval not implemented yet");
	}

	async refreshToken(): Promise<string | null> {
		// TODO: トークンリフレッシュ
		throw new Error("Entra ID token refresh not implemented yet");
	}
}

// 認証プロバイダーファクトリー
export const createAuthProvider = (
	type: "entra-id",
): AuthProvider => {
	switch (type) {
		case "entra-id": {
			// 環境変数から設定を取得
			const tenantId = process.env.NEXT_PUBLIC_ENTRA_TENANT_ID || "";
			const clientId = process.env.NEXT_PUBLIC_ENTRA_CLIENT_ID || "";
			return new EntraIdAuthProvider(tenantId, clientId);
		}
		default:
			throw new Error(`Unsupported auth provider: ${type}`);
	}
};

// 認証状態管理（React Contextで使用予定）
export class AuthManager {
	private provider: AuthProvider;
	private authState: AuthState = {
		isAuthenticated: false,
		user: null,
		token: null,
	};

	constructor(provider: AuthProvider) {
		this.provider = provider;
	}

	async login(): Promise<AuthState> {
		this.authState = await this.provider.login();
		return this.authState;
	}

	async logout(): Promise<void> {
		await this.provider.logout();
		this.authState = {
			isAuthenticated: false,
			user: null,
			token: null,
		};
	}

	getAuthState(): AuthState {
		return this.authState;
	}

	async getAuthHeader(): Promise<string | null> {
		const token = await this.provider.getToken();
		return token ? `${token}` : null;
	}
}

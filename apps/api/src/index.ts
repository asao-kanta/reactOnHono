import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createAuthFlowHandlers, sessionAuthMiddleware } from "./middleware/auth";
import frontendRoute from "./routes/frontend";
import todoRouter from "./routes/todo";

const app = new Hono();

// データベース初期化関数
async function initializeDatabase() {
	try {
		const { PrismaClient } = await import("@prisma/client");
		const prisma = new PrismaClient();

		// テーブルが存在するかチェックし、存在しない場合は作成
		await prisma.$executeRaw`
			CREATE TABLE IF NOT EXISTS Todo (
				id VARCHAR(191) NOT NULL PRIMARY KEY,
				title VARCHAR(191) NOT NULL,
				description TEXT NOT NULL,
				status ENUM('todo', 'in_progress', 'done') NOT NULL,
				importance DOUBLE NOT NULL DEFAULT 0.5,
				createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
				updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
			)
		`;

		console.log("✅ Database tables initialized successfully");
		await prisma.$disconnect();
	} catch (error) {
		console.error("❌ Database initialization failed:", error);
		// 初期化に失敗してもアプリケーションは継続
	}
}

// アプリケーション起動時にデータベースを初期化
initializeDatabase();

// ログ出力を有効化
app.use("*", logger());

// CORS設定
app.use(
	"*",
	cors({
		origin: "*",
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
	}),
);

// エラーハンドリング
app.onError((err, c) => {
	console.error("❌ Error occurred:", err);
	console.error("Stack trace:", err.stack);

	// HTTPExceptionの場合は、元のレスポンスをそのまま返す
	if ((err as any).status === 401 && err.constructor.name === "HTTPException") {
		return (err as any).res;
	}

	return c.json({ error: err.message }, 500);
});

// health check（認証なし - モニタリング用）
app.get("/health", (c) => {
	console.log("🏥 Health check accessed");
	return c.json({ status: "ok" });
});

// OAuth2認証エンドポイント（認証なし）
const authHandlers = createAuthFlowHandlers();
app.get("/auth/login", authHandlers.startLogin);
app.get("/auth/callback", authHandlers.handleCallback);
app.post("/auth/logout", authHandlers.logout);
app.get("/auth/me", authHandlers.getCurrentUser);

// APIルートには認証を適用（Entra ID session認証）
app.use("/api/*", sessionAuthMiddleware);

app.route("/api/todos", todoRouter);

// フロントエンドの静的ファイル配信（認証なし）
app.route("/", frontendRoute);

export default app;

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Hono } from "hono";

const frontendRoute = new Hono();

// MIMEタイプのマッピング
const getMimeType = (filename: string): string => {
	const ext = filename.split(".").pop()?.toLowerCase();
	const mimeTypes: { [key: string]: string } = {
		html: "text/html",
		css: "text/css",
		js: "application/javascript",
		json: "application/json",
		png: "image/png",
		jpg: "image/jpeg",
		jpeg: "image/jpeg",
		gif: "image/gif",
		svg: "image/svg+xml",
		ico: "image/x-icon",
		woff: "font/woff",
		woff2: "font/woff2",
		ttf: "font/ttf",
		eot: "application/vnd.ms-fontobject",
	};
	return mimeTypes[ext || ""] || "application/octet-stream";
};

// 静的ファイルを読み込む関数
const serveStaticFile = (filePath: string) => {
	try {
		const fullPath = join(process.cwd(), filePath);
		const content = readFileSync(fullPath);
		return { content, exists: true };
	} catch (error) {
		return { content: null, exists: false };
	}
};

// 静的ファイル（CSS、JS、assets等）
frontendRoute.get("/assets/*", async (c) => {
	const path = c.req.path;
	const filePath = `dist${path}`;
	const { content, exists } = serveStaticFile(filePath);

	if (!exists || !content) {
		return c.notFound();
	}

	const mimeType = getMimeType(path);
	return c.body(content, 200, {
		"Content-Type": mimeType,
		"Cache-Control": "public, max-age=31536000", // 1年間キャッシュ
	});
});

// その他の静的ファイル（favicon.ico等）
frontendRoute.get("/favicon.ico", async (c) => {
	const { content, exists } = serveStaticFile("dist/favicon.ico");
	if (!exists || !content) {
		return c.notFound();
	}
	return c.body(content, 200, {
		"Content-Type": "image/x-icon",
		"Cache-Control": "public, max-age=86400", // 1日間キャッシュ
	});
});

// SPA用index.htmlフォールバック（最後に配置）
frontendRoute.get("*", async (c) => {
	const { content, exists } = serveStaticFile("dist/index.html");
	if (!exists || !content) {
		return c.text("Frontend not found", 404);
	}
	return c.html(content.toString(), 200, {
		"Cache-Control": "no-cache, no-store, must-revalidate",
	});
});

export default frontendRoute;

import { handle } from "hono/aws-lambda";
import app from "./index";

export const handler = handle(app);

// CommonJS形式でもエクスポート（Lambda互換性のため）
module.exports = { handler: handle(app) };

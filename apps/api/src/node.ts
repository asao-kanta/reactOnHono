import { serve } from "@hono/node-server";
import app from "./index";

console.log("🚀 Starting server on port 3000...");
serve({ fetch: app.fetch, port: 3000 });
console.log("✅ Server started successfully on http://localhost:3000");

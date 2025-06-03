import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	base: "/prod/",
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
	resolve: {
		alias: {
			"@api": path.resolve(__dirname, "../api/src"),
		},
	},
	define: {
		global: "globalThis",
	},
	optimizeDeps: {
		exclude: ["@prisma/client"],
	},
	build: {
		rollupOptions: {
			external: ["@prisma/client", ".prisma/client"],
		},
	},
	root: ".",
});

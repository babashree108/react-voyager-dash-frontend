import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    // Proxy API calls in dev to the local all-in-one container's nginx (port 80)
    // so requests to "/api/*" reach the Spring Boot backend.
    proxy: {
      "/api": {
        target: "http://localhost",
        changeOrigin: true,
        // keep the /api prefix (nginx expects /api -> backend /api)
        // so no rewrite is necessary.
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

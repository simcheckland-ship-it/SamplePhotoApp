import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import cesium from "vite-plugin-cesium";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), cesium()],
  // server: {
  //   watch: {
  //     usePolling: true,
  //   },
  //   host: true, // Needed for Docker tracking
  //   strictPort: true,
  //   port: 5173,
  // },
  server: {
    proxy: {
      "/local-network": {
        target: "https://192.168.0.200", // Your local IP backend base
        changeOrigin: true,
        secure: false, // Bypasses the self-signed HTTPS certificate block
        rewrite: (path) => path.replace(/^\/local-network/, ""),
      },
    },
  },
});

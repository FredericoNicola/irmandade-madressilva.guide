import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://irmandade-madressilva-guide.onrender.com",
        changeOrigin: true,
      },
      "/uploads": {
        target: "https://irmandade-madressilva-guide.onrender.com",
        changeOrigin: true,
      },
    },
  },
});

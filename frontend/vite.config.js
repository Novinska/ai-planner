import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "PLANAI — Інтелектуальний планувальник",
        short_name: "plannAI",
        description: "Організуй свій день за допомогою ШІ",
        display: "standalone",
        background_color: "#120d24",
        theme_color: "#120d24",
        orientation: "portrait",
        icons: [
          {
            src: "/pwa-logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        server: {
          proxy: {
            "/api": "http://localhost:5000",
          },
        },
      },
    }),
  ],
});

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";  // 추가



// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL, // ⭐ 포인트
          changeOrigin: true,
        },
      },
    },

    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "ZzicGo",
          short_name: "ZzicGo",
          start_url: "/",
          scope: "/",
          display: "standalone",
          background_color: "#ffffffff",
          theme_color: "#ffffffff",
          icons: [
            {
              src: "/icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icon-512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
    ],
  };
});
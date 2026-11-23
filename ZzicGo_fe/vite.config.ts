import { defineConfig, loadEnv, type Plugin, type PreviewServer, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";  // 추가

function standalonePages(): Plugin {
  const pageFor = (pathname: string) => ({
    "/interview": "/interview/index.html",
    "/interview/": "/interview/index.html",
  }[pathname]);
  const rewrite = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use((request, _response, next) => {
      const url = request.url ?? "";
      const pathname = url.split("?")[0];
      const page = pageFor(pathname);
      if (page) request.url = `${page}${url.includes("?") ? `?${url.split("?").slice(1).join("?")}` : ""}`;
      next();
    });
  };

  return {
    name: "standalone-pages",
    configureServer: rewrite,
    configurePreviewServer: rewrite,
  };
}



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
      standalonePages(),
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
    build: {
      rollupOptions: {
        input: {
          app: "index.html",
        },
      },
    },
  };
});

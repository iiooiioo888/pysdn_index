import compression from 'compression';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
var PUBLIC_BASE = '/pysdn_index/';
var PUBLIC_BASE_NO_SLASH = PUBLIC_BASE.replace(/\/$/, '');
/**
 * Dev-only：將 `/` 與 `/pysdn_index` **改寫**為 `base` 路徑（不發 302），避免 Lighthouse
 * 「第一個要求有重新導向」與額外延遲；實際部署若走 GitHub Pages，仍建議直接打帶 base 的網址。
 */
function devRewriteRootToBase() {
    return {
        name: 'dev-rewrite-root-to-base',
        apply: 'serve',
        configureServer: function (server) {
            server.middlewares.use(function (req, res, next) {
                var _a;
                var raw = (_a = req.url) !== null && _a !== void 0 ? _a : '/';
                var pathname = raw;
                var q = raw.indexOf('?');
                if (q !== -1)
                    pathname = raw.slice(0, q);
                var search = q !== -1 ? raw.slice(q) : '';
                if (pathname === '/' || pathname === '') {
                    req.url = "".concat(PUBLIC_BASE).concat(search);
                    next();
                    return;
                }
                if (pathname === PUBLIC_BASE_NO_SLASH) {
                    req.url = "".concat(PUBLIC_BASE).concat(search);
                    next();
                    return;
                }
                next();
            });
        },
    };
}
export default defineConfig({
    plugins: [
        {
            name: 'dev-preview-compression',
            configureServer: function (server) {
                server.middlewares.use(compression({ threshold: 1024 }));
            },
            configurePreviewServer: function (server) {
                server.middlewares.use(compression({ threshold: 1024 }));
            },
        },
        devRewriteRootToBase(),
        react(),
    ],
    base: PUBLIC_BASE,
    server: {
        port: 3000,
        host: true,
        /* With non-root `base`, string `open` is resolved under `base` → duplicate path. Use `true` only. */
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        cssMinify: true,
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
                        return 'vendor';
                    }
                    if (id.includes('node_modules/react-router')) {
                        return 'router';
                    }
                    if (id.includes('node_modules/react-i18next/') || id.includes('node_modules/i18next/')) {
                        return 'i18n';
                    }
                },
            },
        },
        chunkSizeWarningLimit: 600,
    },
});

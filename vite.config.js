import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/app.jsx", "resources/css/app.css"],
            refresh: true,
        }),
        react(),
    ],
    server: {
        hmr: false,
    },
    css: {
        postcss: {
            plugins: [tailwindcss(), autoprefixer()],
        },
    },
    build: {
        manifest: "manifest.json",
        outDir: 'public/build',
        rollupOptions: {
            input: {
                app: 'resources/js/app.jsx',
                css: 'resources/css/app.css'
            }
        }
    }
});
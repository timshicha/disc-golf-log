import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/postcss";
import fs from "fs";

export default defineConfig({
    server: {
        https: {
            key: fs.readFileSync("./localhost-key.pem"),
            cert: fs.readFileSync("./localhost.pem")
        },
        port: 5173
    },
    plugins: [
        react(),
        tailwindcss()
    ],
    optimizeDeps: {
        exclude: ["sql.js"]
    },
});
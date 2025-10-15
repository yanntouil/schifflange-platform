import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import autoImport from "unplugin-auto-import/vite"
import { defineConfig, loadEnv, PluginOption } from "vite"
import viteCompression from "vite-plugin-compression"
import svgr from "vite-plugin-svgr"
import { changeLog } from "./vite.change-log.plugins"

/**
 * vite config
 * @see https://vitejs.dev/config
 */
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), "")

  const processEnvValues = {
    "process.env": Object.entries(env).reduce(
      (acc, [key, val]) => {
        if (key.startsWith("VITE_APP_")) {
          acc[key] = JSON.stringify(val)
        }
        return acc
      },
      {} as Record<string, string>
    ),
  }

  return defineConfig({
    define: processEnvValues,
    plugins: [
      react(),
      tailwindcss(),
      svgr({
        svgrOptions: {
          replaceAttrValues: {
            "#000": "currentColor",
            "#000000": "currentColor",
            black: "currentColor",
          },
        },
      }),
      autoImport({
        include: [/\.[tj]sx?$/],
        dts: "./src/auto-imports.d.ts",
        imports: [
          {
            react: [["default", "React"]],
            "class-variance-authority": ["cx"],
            "tailwind-merge": [["twMerge", "cxm"]],
            "ts-pattern": ["match"],
          },
        ],
      }),
      viteCompression(),
      changeLog(),
    ] as PluginOption[],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {},
    server: {
      hmr: true,
      host: "0.0.0.0",
      port: parseInt(env.PORT || "3000"),
      watch: {
        // Exclure les autres apps du monorepo
        ignored: [
          "**/backend/**",
          "**/sites/**",
          "**/node_modules/**",
          "**/.git/**",
          // Fichiers root non pertinents pour le dashboard
          "../../CLAUDE.md",
          "../../README.md",
          "../../*.json",
          "../../*.js",
          "../../*.ts",
          "../../*.yml",
          "../../*.yaml",
          "../../scripts/**",
        ],
      },
    },
    build: {
      outDir: "./out/prod",
      manifest: true,
      rollupOptions: {
        input: ["index.html"],
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            ui: ["lucide-react", "@tanstack/react-table"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      minify: "esbuild",
    },
  })
}

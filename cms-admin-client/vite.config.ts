// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import Unfonts from "unplugin-fonts/vite";
import AutoImport from "unplugin-auto-import/vite";
import VueRouter from "unplugin-vue-router/vite";
import { VueRouterAutoImports } from "unplugin-vue-router";
import Layouts from "vite-plugin-vue-layouts";

// Utilities
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      VueRouter({
        routesFolder: "src/views",
        extensions: [".vue"],
        exclude: ["src/views/**/components"],
        dts: "./typed-router.d.ts",
      }),
      vue({
        template: { transformAssetUrls },
      }),
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
      vuetify({
        autoImport: true,
      }),
      AutoImport({
        dts: true,
        imports: [
          "vue",
          "@vueuse/core",
          "pinia",
          VueRouterAutoImports,
          {
            "vue-router/auto": ["useLink", "createRouter", "createWebHistory"],
          },
        ],
        vueTemplate: true,
      }),
      Layouts({
        layoutsDirs: "src/layouts",
        defaultLayout: "default",
      }),
      Unfonts({
        // Fontsource API
        fontsource: {
          /**
           * Fonts families lists
           */
          families: [
            {
              /**
               * Name of the font family.
               * Require the `@fontsource/roboto` package to be installed.
               */
              name: "noto-serif-sc",
              /**
               * Load only a subset of the font family.
               */
              weights: [400, 700],
              subset: "chinese-simplified",
            },
          ],
        },
      }),
    ],
    define: { "process.env": {} },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "#": fileURLToPath(new URL("./typings", import.meta.url)),
      },
      extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
    },
    server: {
      port: Number(env["VITE_PORT"]),
    },
  };
});

import { defineConfig, loadEnv } from "vite";
import { wrapperEnv, pathResolve, __APP_INFO__ } from "./build/utils";
import { getPluginsList } from "./build/plugins";
import { include, exclude } from "./build/optimize";

export default defineConfig(({ mode }) => {
  const { VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH } = wrapperEnv(
    loadEnv(mode, process.cwd())
  );
  return {
    base: VITE_PUBLIC_PATH,
    root: pathResolve(".", import.meta.url),
    resolve: {
      alias: {
        "@": pathResolve("./src", import.meta.url),
        "@build": pathResolve("./build", import.meta.url),
      },
    },
    server: {
      port: VITE_PORT,
      host: "0.0.0.0",
      proxy: {},
      warmup: {
        clientFiles: ["./index.html", "./src/{views,compnents}/*"],
      },
    },
    plugins: getPluginsList(VITE_COMPRESSION),
    optimizeDeps: { include, exclude },
    build: {
      target: "es2015",
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: pathResolve("./index.html", import.meta.url),
        },
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        },
      },
    },
    define: {
      // 禁用选项式API支持，如果第三方库依赖选项式，会影响兼容性
      __VUE_OPTIONS_API__: false,

      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  };
});

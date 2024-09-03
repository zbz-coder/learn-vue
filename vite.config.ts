import { defineConfig, loadEnv } from "vite";
import { root, pathResolve } from "./build/utils";

console.log("------------------");
console.log(root);
console.log(pathResolve());
console.log(import.meta.url)

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  console.log(mode, command);
  return {};
});

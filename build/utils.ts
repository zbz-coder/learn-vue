import { cwd } from "node:process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** 启动`node`时所在目录的绝对路径 */
const root: string = cwd();

function pathResolve(dir = ".", metaUrl = import.meta.url) {
  // 当前文件目录的绝对路径
  const currentFileDir = dirname(fileURLToPath(metaUrl));
  console.log(currentFileDir);
  // build 目录的绝对路径
  const buildDir = resolve(currentFileDir);
  console.log("buildDir: ", buildDir);
  // 解析的绝对路径
  const resolvedPath = resolve(currentFileDir, dir);
  console.log("resolve: ", resolvedPath);

  return resolvedPath.startsWith(buildDir)
    ? fileURLToPath(metaUrl)
    : resolvedPath;
}
console.log("res: ", pathResolve());

export { root, pathResolve };

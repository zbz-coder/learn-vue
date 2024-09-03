import { dirname } from "path";
import { fileURLToPath } from "url";

/** 启动`node`进程时所在目录的绝对路径 */
const root: string = process.cwd();
console.log(process.cwd());

function pathResolve(dir = ".", metaUrl = import.meta.url) {
  // 当前文件所在目录的绝对路径
  const currentFileDir = dirname(fileURLToPath(metaUrl));
  console.log(currentFileDir);
}
pathResolve();

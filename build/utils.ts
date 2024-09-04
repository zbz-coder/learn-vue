import dayjs from "dayjs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  name,
  version,
  engines,
  dependencies,
  devDependencies,
} from "../package.json";
import { readdir, stat } from "node:fs";

/**
 * @description 根据可选的路径片段生成绝对路径
 * @param dir 路径片段，默认 build
 * @param metaUrl 模块的完整 `url`,如果在 `build` 目录外调用必传 `import.meta.url`
 */
function pathResolve(dir = ".", metaUrl = import.meta.url) {
  // 当前文件目录的绝对路径
  const currentFileDir = dirname(fileURLToPath(metaUrl));
  // 解析的绝对路径
  const resolvedPath = resolve(currentFileDir, dir);

  return resolvedPath;
}

/** 应用有关信息 */
const __APP_INFO__ = {
  pkg: { name, version, engines, dependencies, devDependencies },
  lastBuildTime: dayjs().format("YYYY-MM-DD"),
};

/** 环境变量处理 */
function wrapperEnv(envConf: Record<string, any>): ViteEnv {
  // 默认值
  const ret: ViteEnv = {
    VITE_PORT: 8848,
    VITE_PUBLIC_PATH: "",
    VITE_ROUTER_HISTORY: "",
    VITE_HIDE_HOME: false,
    VITE_COMPRESSION: "none",
  };

  Object.keys(envConf).forEach(key => {
    ret[key] = envConf[key];
    process.env[key] = JSON.stringify(envConf[key]);
  });

  return ret;
}

/** 求number类型数组的和 */
const sum = (arr: Array<number>): number =>
  arr.reduce((pre, item) => (pre += item));

const fileListTotal = [];

/**
 * @description 获取指定文件夹中所有文件的总大小
 * @param options 选项
 */
function getPackageSize(
  folder = "dist",
  callback: (totalFileSize: number) => void
) {
  readdir(folder, (err, files: Array<string>) => {
    if (err) throw err;
    if (files.length === 0) {
      callback(0);
      return;
    }
    let count = 0;
    const checkEnd = () => {
      if (files.length == ++count) callback(sum(fileListTotal));
    };
    files.forEach((item: string) => {
      stat(`${folder}/${item}`, async (err, stats) => {
        if (err) throw err;
        if (stats.isFile()) {
          fileListTotal.push(stats.size);
          checkEnd();
        } else if (stats.isDirectory()) {
          getPackageSize(`${folder}/${item}/`, checkEnd);
        }
      });
    });
  });
}

export { pathResolve, __APP_INFO__, wrapperEnv, getPackageSize };

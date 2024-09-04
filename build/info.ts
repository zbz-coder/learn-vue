import type { Plugin } from "vite";
import { getPackageSize } from "./utils";
import dayjs, { type Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import gradientString from "gradient-string";
import boxen, { type Options as BoxenOptions } from "boxen";
dayjs.extend(duration);

const welcomeMessage = gradientString("cyan", "magenta").multiline(
  "欢迎学习Vue3\n本项目拥有详细的类型支持以及完整的备注\n有任何问题请 issues 留言"
);

const boxenOptions: BoxenOptions = {
  padding: 0.5,
  title: "learn-vue",
  titleAlignment: "center",
  borderStyle: "round",
  borderColor: "cyan",
  textAlignment: "left",
};

export function viteBuildInfo(): Plugin {
  let config: { command: string };
  let startTime: Dayjs;
  let endTime: Dayjs;
  let outDir: string;
  return {
    name: "vite:buildInfo",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      outDir = resolvedConfig.build?.outDir ?? "dist";
    },
    buildStart() {
      console.log(boxen(welcomeMessage, boxenOptions));
      if (config.command === "build") {
        startTime = dayjs();
      }
    },
    closeBundle() {
      if (config.command === "build") {
        endTime = dayjs();
        getPackageSize(outDir, size => {
          console.log(
            boxen(
              gradientString("cyan", "magenta").multiline(
                `🎉 恭喜打包完成（总用时${dayjs
                  .duration(endTime.diff(startTime))
                  .format("mm分ss秒")}，打包后的大小为${size}）`
              ),
              boxenOptions
            )
          );
        });
      }
    },
  };
}

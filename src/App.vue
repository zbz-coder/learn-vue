<script lang="ts">
import { checkVersion } from "version-rocket";
import { defineComponent } from "vue";
import { ElConfigProvider } from "element-plus";

export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
  },
  beforeCreate() {
    const { version, name: title } = __APP_INFO__.pkg;
    const { VITE_PUBLIC_PATH, MODE } = import.meta.env;
    if (MODE === "production") {
      // 版本实时更新检测, 只作用于线上环境
      checkVersion(
        {
          pollingTime: 300000,
          immediate: true,
          localPackageVersion: version,
          originVersionFileUrl: `${location.origin}${VITE_PUBLIC_PATH}version.json`,
        },
        {
          title,
          description: "检测到新版本",
          buttonText: "立即更新",
        }
      );
    }
  },
});
</script>

<template>
  <el-config-provider>
    <router-view />
  </el-config-provider>
</template>

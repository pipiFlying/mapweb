const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/styles/base.scss";`,
      },
    },
  },
})

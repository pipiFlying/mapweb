const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production'
    ? 'mapweb'
    : '/',
  outputDir: 'dist',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/styles/base.scss";`,
      },
    },
  },
})

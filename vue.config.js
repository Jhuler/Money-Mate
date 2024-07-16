const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "Money Mate",
    themeColor: "#f1c72e",
    display: "standalone",
    manifestOptions: {
      background_color: "#ffffff",
      start_url: "/signin",
    },
    iconPaths: {
      // faviconSVG: 'img/icons/favicon.svg',
      favicon32: 'img/icons/favicon.ico',
      // favicon16: 'img/icons/favicon-16x16.png',
      // appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      // maskIcon: 'img/icons/safari-pinned-tab.svg',
      // msTileImage: 'img/icons/msapplication-icon-144x144.png'
    }
  }
})
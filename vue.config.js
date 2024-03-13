const path = require('path');

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    port: 8080,
    open: true,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true
      },
      '/ipfs': {
        target: 'http://192.168.1.111:8080',
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('babel')
      .test(/\.js$/)
      .include.add(path.resolve(__dirname, 'node_modules/ethers/'))
      .add(path.resolve(__dirname, 'node_modules/@noble/'))
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .end();
  },

}
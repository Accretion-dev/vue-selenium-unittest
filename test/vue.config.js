const testConfig = require('./test-config.json')
module.exports = {
  devServer: {
    port: testConfig.appPort
  },
  configureWebpack: {
    plugins: [
    ]
  }
}

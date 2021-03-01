// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path');

const apiArg = process.env.API;

let apiTarget = '';
switch (apiArg) {
  case 'production':
    apiTarget = 'http://rai-dashboard.malongtech.cn/';
    break;
  case 'stage':
    apiTarget = 'https://staging-rai-dashboard.malongtech.cn/';
    break;
  case 'test':
    apiTarget = 'https://test-rai-dashboard.malongtech.cn/';
    break;
  case 'local':
    apiTarget = 'http://0.0.0.0:9600/';
    break;
  case 'dev':
    apiTarget = 'https://dev-rai-dashboard.malongtech.cn/';
    break;
  default:
    apiTarget = 'http://localhost:9600/';
    break;
}

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../../back/src/static/index.html'),
    assetsRoot: path.resolve(__dirname, '../../back/src/static'),
    assetsSubDirectory: 'assets',
    assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '**/**.fl': { target: apiTarget, changeOrigin: true },
      '**/**.csv': { target: apiTarget, changeOrigin: true },
      '/oss/**': { target: apiTarget, changeOrigin: true },
      '/v2/images/**': { target: apiTarget, changeOrigin: true },
      '/v2/work-orders/attachments': { target: apiTarget, changeOrigin: true },
      '/v2/exceptions/data-forms': { target: apiTarget, changeOrigin: true }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
};

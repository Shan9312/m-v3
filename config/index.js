
'use strict'
// Template version: 1.1.3
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

const args = process.argv.splice(2)
let index_path = path.resolve(__dirname, '../dist/index.html');
let assetsRoot_path = path.resolve(__dirname, '../dist');
let _env = 'reach_dist'

if(args[0] === 'prod'){
  if(args[1]){
    _env = args[1];
  }
  index_path = path.resolve(__dirname, `../server/public/${_env}/dist/index.html`);
  assetsRoot_path = path.resolve(__dirname, `../server/public/${_env}/dist`)
}

module.exports = {
  type: args[0],
  env: _env,
  build: {
    env: require('./prod.env'),
    index: index_path,
    assetsRoot: assetsRoot_path,
    assetsSubDirectory: 'static',
    // assetsPublicPath: '/',
    assetsPublicPath:  './',
    //assetsPublicPath: 'http://reach.doooly.com/dist99/',
    //assetsPublicPath: 'https://prodist.oss-cn-hangzhou.aliyuncs.com/dist/',
    productionSourceMap: false,
    devtool: '#source-map',
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: process.env.PORT || 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    // host: '192.168.1.157', // can be overwritten by process.env.HOST
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    proxyTable: {
      '/reachtest': {
        target: 'http://test1.doooly.com',//设置你调用的接口域名和端口号 别忘了加http
        changeOrigin: true,
        pathRewrite: {
          '^/reachtest': '/reachtest'//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
      },
      '/admin': {
        target: 'https://admin.doooly.com',// 本地ip
        changeOrigin: true,
        pathRewrite: {
          '^/admin': ''
        }
      },
      '/admin8410': {
        target: 'https://test.doooly.cn:8410',// 本地ip
        changeOrigin: true,
        pathRewrite: {
          '^/admin': ''
        }
      },
      // '/admin8480': {
      //   target: 'https://test.doooly.cn:8480',// 本地ip
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/admin8480': ''
      //   }
      // },
      '/hua': {
        target: 'http://47.92.199.89:1080',// 本地ip
        changeOrigin: true,
        pathRewrite: {
          '^/hua': ''
        }
      },
    },

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}

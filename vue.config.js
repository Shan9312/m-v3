const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir)
}

console.log(process.env.NODE_ENV)
console.log(process.env.PUBLIC_PATH)

module.exports = {
    publicPath: process.env.PUBLIC_PATH || './',
    productionSourceMap: false,
    chainWebpack: config => {
        // modify html-webpack-plugin options
        config.plugin('html').tap(args => {
            args[0].commonResourcePath = process.env.COMMON_RESOURCE_PATH; // set common resource path
            args[0].publicPath = process.env.PUBLIC_PATH; // set public path
            return args;
        });
        // config.entry('main').add('babel-polyfill');
        config.resolve.alias
            .set('@', resolve('src'))
            .set('v3', resolve('src/components/doooly/v3'))
        config.plugins.delete('prefetch')
    },
    devServer: {
        port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    }
}
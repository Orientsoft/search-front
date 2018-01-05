'use strict';

const paths = require('./paths');

const host = '0.0.0.0';
const port = '1250';

const apiProxy = "http://192.168.0.48:5000";

module.exports = {
    compress: true,
    contentBase: paths.appPublic,
    watchContentBase: true,
    historyApiFallback: true,
    hot: true,
    publicPath: '/',
    quiet: true,
    watchOptions: {
        ignored: /node_modules/,
    },
    // proxy all api requests to testserver:5000
    proxy: {
        "/api/**": {
            target: apiProxy,
            changeOrigin: true,
            cookieDomainRewrite: {
                "*": ""
            }
        }
    },
    host: host,
    port: port
};
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const { merge } = require('webpack-merge')

module.exports = merge(webpackConfig, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        port: 3000,
        hot: true,
        // hotOnly: true, // hmr失效的时候，不会重新刷新
        contentBase: './dist',
        open: true,
    },
    optimization: {
        usedExports: true, // development配置tree shaking
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
})



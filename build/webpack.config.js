const webpack = require("webpack")
const path = require("path")

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWepbackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

const isProdMode = process.argv.indexOf("--mode=production") !== -1
const isDevMode = process.argv.indexOf("--mode=development") !== -1
const isAnalyze = process.argv.indexOf("--profile") !== -1

const getStyleLoaders = (cssOptions, preProcessors) => {
    const loaders = [
        isDevMode && "style-loader",
        isProdMode && MiniCssExtractPlugin.loader,
        {
            loader: require.resolve("css-loader"),
            options: cssOptions,
        },
        {
            loader: require.resolve("postcss-loader"),
            options: {
                postcssOptions: {
                    plugins: [
                        require("postcss-preset-env")({
                            autoprefixer: {
                                overrideBrowderslist: "andoroid >= 4.3",
                            },
                            stage: 3,
                        }),
                        require("postcss-plugin-px2rem")({
                            rootValue: 75,
                            minPixelValue: 2,
                        }),
                    ],
                },
            },
        },
    ].filter(Boolean)

    if (preProcessors) {
        loaders.push({
            loader: require.resolve(preProcessors),
        });
    }
    return loaders
};

const getFileLoader = (limit, name) => {
    return {
        loader: "url-loader",
        options: {
            limit,
            esModule: false,
            name,
            fallback: {
                loader: "file-loader",
                options: {
                    name,
                    esModule: false,
                },
            },
        },
    };
};

const plugins = [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
        filename: "[name].[contenthash:8].css",
        chunkFilename: "[name].[contenthash:8].chunk.css",
    }),
]

isAnalyze &&
    plugins.unshift(
        new BundleAnalyzerPlugin({
            analyzerMode: "disabled", // 不启动展示打包报告的http服务器
            generateStatsFile: true, // 是否生成stats.json文件
        })
    )


const makePlugins = (configs, plugins) => {
    // 支持多文件配置
    Object.keys(configs.entry).forEach((item) => {
        plugins.push(
            new HtmlWepbackPlugin({
                // 使用现有的template, 而不是HtmlWepbackPlugin自己生成一个新的html
                template: path.resolve(__dirname, `../public/${item}.html`),
                filename: `${item}.html`,
                script: {
                    ERUDA: isDevMode
                        ? '<script src="//cdn.bootcdn.net/ajax/libs/eruda/2.3.3/eruda.js"></script><script>eruda.init();</script>'
                        : "",
                },
                chunks: ["runtime", "vendors", 'styles', item],
            })
        );
    })
    return plugins
}

const config = {
    entry: {
        index: "./src/index.tsx",
    },
    output: {
        publicPath: isProdMode ? "./" : "/",
        filename: "js/[name].js",
        path: path.resolve(__dirname, "../dist"),
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", "json"],
        alias: {
            "@": path.resolve(__dirname, "../src"),
            assets: path.resolve(__dirname, "../assets"),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        cacheCompression: isProdMode
                    }
                }
            },
            {
                test: /\.(ts|tsx)$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: getStyleLoaders({
                    importLoaders: 1,
                }),
            },
            {
                test: /\.(scss|sass)$/,
                exclude: /\.module\.(scss|sass)$/,
                use: getStyleLoaders(
                    {
                        importLoaders: 2,
                    },
                    "sass-loader"
                ),
            },
            {
                test: /\.module\.(scss|sass)$/,
                use: getStyleLoaders({
                    importLoaders: 2,
                    sourceMap: isProdMode,
                    modules: {
                        localIdentName: '[local]_[hash:base64:6]'
                    },
                }, 'sass-loader')
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                dependency: { not: ['url'] },
                use: getFileLoader(1024, "static/img/[name].[hash:8].[ext]"),
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                dependency: { not: ['url'] },
                use: getFileLoader(1024, "static/media/[name].[hash:8].[ext]"),
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/i,
                dependency: { not: ['url'] },
                use: getFileLoader(1, "static/font/[name].[hash:8].[ext]"),
            },
        ],
    },
    optimization: {
        runtimeChunk: {
            name: "runtime",
        },
        splitChunks: {
            chunks: "all",
            // minSize: 30000,
            // maxSize: 0,
            // minChunks: 1,
            // maxAsyncRequests: 6,
            // maxInitialRequests: 4,
            // automaticNameDelimiter: "~",
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    enforce: true,
                    test: /[\\/]node_modules[\\/]/,
                    priority: 20,
                    reuseExistingChunk: true,
                },
                styles: {
                    name: 'styles',
                    test: /\.(scss|sass|css|less)$/,
                    chunks: 'all',
                    enforce: true,
                    priority: 10,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
}

config.plugins = makePlugins(config, plugins)

module.exports = config

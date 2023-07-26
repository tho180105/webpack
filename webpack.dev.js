const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = merge(common,
    {
        output: {
            path: path.resolve(__dirname, 'public'),
        },
        devtool: 'cheap-module-source-map',
        stats: 'errors-warnings',
        optimization: {
            minimize: false,
        },
        performance: {
            hints: false,
        },

        module: {
            rules: [
                {
                    test: /\.[jt]sx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: require.resolve('babel-loader'),
                            options: {
                                plugins: [ require.resolve('react-refresh/babel')].filter(Boolean),// xử lí cùng vs react-refresh-webpack-plugin
                            },
                        },
                    ],
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /[ac]ss$/i,
                    include: /src/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        },

                    ],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',//emits a separate file and exports the URL.
                    generator: {
                        filename: 'static/img/[hash][ext]',
                    }
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                },
            ],

        },
        plugins: [
            new ReactRefreshWebpackPlugin()
        ].filter(Boolean),
        mode: 'development',
    },
);

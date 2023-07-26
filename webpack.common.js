const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');
const webpack = require("webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const glob = require('glob');
const entries = glob.sync('./src/*/*/skin/*').reduce((entries, entry) => {
    const entryName = path.parse(entry).name
    entries[entryName] = entry
    return entries
}, {});
// console.log(entries)
const resolveEntries = {};
(() => {
    for (const [key, value] of Object.entries(entries)) {
        if (key.match(/common/)) {
            if (resolveEntries.index) {
                resolveEntries.index.import.push(value)
                continue;
            } else {
                resolveEntries.index = {}
                resolveEntries.index.import = []
                resolveEntries.index.import.push(value)
                continue;
            }
        }
        if (key.match(/dark/)) {
            if (resolveEntries.dark) {
                resolveEntries.dark.import.push(value)
                continue;
            } else {
                resolveEntries.dark = {}
                resolveEntries.dark.import = []
                resolveEntries.dark.import.push(value)
                continue;
            }
        }
        if (key.match(/light/)) {
            if (resolveEntries.light) {
                resolveEntries.light.import.push(value)
            } else {
                resolveEntries.light = {}
                resolveEntries.light.import = []
                resolveEntries.light.import.push(value)
            }
        }
    }
})()
resolveEntries.index.import.push("./src/index.tsx")
resolveEntries.index.import.push("./src/common-index.css")
// console.log(resolveEntries)

const config= {
    entry: resolveEntries,//file nào dđể trước bundle trc
    output: {
        filename: "./static/js/[name].js",
        clean: true,
        pathinfo: false,
        chunkFilename: "./static/js/[id].chunk.js",
    },
    context: path.resolve(__dirname, "./"),
    devServer: {
        port: 3000,
        open: true,//open browser when start
        hot: true,//enable HMR
        historyApiFallback: true,
        client: {
            reconnect: 2,
            // progress:true,//log progress on console tab
            logging: 'warn',//dev-serve log
            overlay: true,
        },
    },
    performance: {
        hints: false,
    },
    cache: {
        type: 'filesystem',
        allowCollectingMemory: true,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts','.tsx','.scss'],// extension to scan
        preferRelative: true,// hỗ trợ thêm ./
    },
    stats: 'errors-warnings',
    plugins: [
        new HtmlWebpackPlugin({
            filename: "./index.html",
            template: './src/index.html',
            favicon: './src/favicon.ico',
            inject: false,
        }),
        new webpack.ProvidePlugin({
            "React": "react",
            process: 'process/browser',
        }),
        new MiniCssExtractPlugin({ //https://webpack.js.org/plugins/mini-css-extract-plugin/#multiple-themes : multiple themes
            filename: (pathData) => {
                if (pathData.chunk.name.includes("index")) {
                    return `./static/css/common.css`;
                } else {
                    return `./static/css/${pathData.chunk.name}.css`
                }
            },
            chunkFilename: './static/non/[name].[contenthash:8].css',// non-initial
        }),
        new WebpackManifestPlugin({
            fileName: 'asset-manifest.json',
            generate: (seed, files, entryPoints) => {
                const manifestFiles = files.reduce((manifest, file) => {
                    manifest[file.name] = file.path;
                    return manifest;
                }, seed);
                const entrypointFiles = entryPoints.index.filter(
                    fileName => !fileName.endsWith('.map')
                );
                return {
                    files: manifestFiles,
                    entrypoints: entrypointFiles,
                };
            },
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "src/locales",
                    to({absoluteFilename}) {
                        const filenameRegex = /\\(\w+)\.json$/g
                        const filename = filenameRegex.exec(absoluteFilename)
                        if (filename[1] === 'translation') {
                            const folderNameRegex = /(.{5})\\\w+\.json$/g
                            const folderName = folderNameRegex.exec(absoluteFilename)
                            return `locales/${folderName[1]}/[name][ext]`
                        } else {
                            const folderAndFilenameRegex = /\\(?<folderName>.{5})\\(?<fileName>\w+)\\\w+\.json$/g
                            const folderAndFilename = folderAndFilenameRegex.exec(absoluteFilename)
                            return `locales/${folderAndFilename.groups.folderName}/${folderAndFilename.groups.fileName}[ext]`
                        }
                    }
                },
            ],
        }),
    ].filter(Boolean),
}

module.exports = config;

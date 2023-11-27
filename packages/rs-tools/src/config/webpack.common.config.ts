/**
 * @file webpack common config
 * @author wjh90201@gmail.com
 */

import webpack, {Configuration} from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CompressionPlugin from 'compression-webpack-plugin';

import BabelConfig from '../constants/babel';
import {toolsConfig} from '../constants';

const COMMON_CONFIG: Configuration = {
    entry: './src/entry',
    resolve: {
        alias: toolsConfig.webpack.alias,
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    output: {
        filename: '[name].[chunkhash:8].js',
        path: toolsConfig.appBuild,
    },
    // 控制webpack如何通知资源超过文件限制的提示，false为不提示
    performance: {
        hints: false,
    },
    plugins: [
        // 开启gzip压缩，提升首屏渲染
        new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css)$/,
            threshold: 10240, // 资源文件大于10240B=10kB时会被压缩
        }),
        // moment本地语言优化
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        new MiniCssExtractPlugin({
            ignoreOrder: true,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: BabelConfig,
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
                type: 'asset',
                generator: {
                    filename: '[name]-[hash].[ext]',
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    },
                },
            },
            {
                test: /\.css$/,
                exclude: /assets|node_modules/,
                use: [MiniCssExtractPlugin.loader, {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                    },
                }],
            },
            {
                test: /\.css$/,
                include: /assets|node_modules/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', {
                    loader: 'less-loader',
                    options: {
                        lessOptions: {
                            javascriptEnabled: true,
                        },
                    },
                }],
            },
        ],
    },
};

export default COMMON_CONFIG;

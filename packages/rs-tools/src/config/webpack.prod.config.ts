/**
 * @file prod config
 * @author wjh90201@gmail.com
 */

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {merge} from 'webpack-merge';
import {Configuration} from 'webpack';

import COMMON_CONFIG from './webpack.common.config';
import {toolsConfig} from '../constants';

const DLL_CONFIG = ['react', 'react-dom', 'react-router', 'react-router-dom', 'react-router-config'];

const PROD_CONFIG: Configuration = {
    mode: 'production',
    output: {
        filename: '[name].[chunkhash:8].js',
        path: toolsConfig.appBuild,
        clean: true,
    },
    optimization: {
        minimizer: ['...', new CssMinimizerPlugin()],
        splitChunks: {
            cacheGroups: {
                dll: {
                    chunks: 'all',
                    test: new RegExp(
                        `${DLL_CONFIG.map(moduleName => `node_modules/${moduleName}/`).join('|')}`,
                    ),
                    priority: 40,
                    enforce: true,
                },
                lib: {
                    test(module: {
                        size: Function
                        nameForCondition: Function
                      }): boolean {
                        return (
                            module.size() > 160000
                          && /node_modules[/\\]/.test(module.nameForCondition() || '')
                        );
                    },
                    priority: 30,
                    minChunks: 1,
                    reuseExistingChunk: true,
                },
            },
            maxInitialRequests: 25,
            minSize: 20000,
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: toolsConfig.htmlWebpackPluginTemplate,
            filename: 'index.html',
            publicPath: `${toolsConfig.appDomain.replace(/\/$/, '')}/`,
        }),
    ],
};

export default merge(COMMON_CONFIG, PROD_CONFIG, toolsConfig.webpack.base, toolsConfig.webpack.server);

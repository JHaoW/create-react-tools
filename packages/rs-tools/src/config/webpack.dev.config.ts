/**
 * @file dev config
 * @author wjh90201@gmail.com
 */

import {merge} from 'webpack-merge';
import {Configuration} from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import COMMON_CONFIG from './webpack.common.config';
import {getHtmlContent} from '../utils';
import {toolsConfig} from '../constants';

const DevConfig: Configuration & {devServer: Record<string, any>} = {
    mode: 'development',
    // 开发时控制台查看源码
    devtool: 'eval-cheap-module-source-map',
    devServer: toolsConfig.devServer,
    plugins: [
        new HtmlWebpackPlugin({
            templateContent: getHtmlContent(toolsConfig.htmlWebpackPluginTemplate),
        }),
    ],
};

export default merge(COMMON_CONFIG, DevConfig, toolsConfig.webpack.base, toolsConfig.webpack.dev);

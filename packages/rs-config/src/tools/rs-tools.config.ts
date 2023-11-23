/**
 * @file dev 默认配置
 * @author wjh90201@gmail.com
 */

import {Configuration} from 'webpack';
import commonConfig from '../constants/common.config';

const toolsDefaultConfig = {
    // less theme 文件路径，基于app root目录
    lessVariableFile: '<APP_ROOT>/src/assets/style/themes/index.less',

    // 多端模板文件目录地址
    clientTemplatesDir: '<APP_ROOT>/client/views/includes',

    // html-webpack-plugin 模板文件路径
    htmlWebpackPluginTemplate: '<APP_ROOT>/client/views/index.ejs',

    // 应用路由前缀
    domain: commonConfig.domain,

    // 静态文件存储目录
    appStatic: '<APP_ROOT>/client/assets',

    // 源文件目录
    appSrc: '<APP_ROOT>/src',

    // 源文件容器组件目录
    appContainers: '<APP_ROOT>/src/containers',

    // 构建目录
    appBuild: '<APP_ROOT>/dist',

    // 多区域支持
    regions: commonConfig.regions,

    // 资源前缀
    publicPath: '/',

    // 默认 webpack 配置
    webpack: {
        alias: commonConfig.alias as Record<string, string>,
        base: {} as Configuration,
        dev: {} as Configuration,
        prod: {} as Configuration,
        server: {} as Configuration,
    },

    devServer: {
        // client 模式下devServer调试端口
        port: 8080,

        // client 模式下devServer调试host
        host: '0.0.0.0',

        // proxy 相关
        proxy: 'http://0.0.0.1:8888/',
    },
};

export type ToolsDefaultConfig = typeof toolsDefaultConfig;
export type ToolsConf = Partial<ToolsDefaultConfig>;

export default toolsDefaultConfig;

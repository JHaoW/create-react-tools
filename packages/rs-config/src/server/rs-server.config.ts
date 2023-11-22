/**
 * @file server 默认配置
 * @author wjh90201@gmail.com
 */
import commonConfig from '../constants/common.config';

const serverDefaultConf = {
    // 这个应该被各个环境具体的配置重写，如 `qa-sandbox00/default.json5` 等
    conf: {
        // 服务端SSR API请求地址，通常指向console-proxy
        apiUrl: '',
    },

    // 服务端缓存配置
    cache: {
        enable: true,
        // 参考koa-cash
        options: {},
    },

    // 是否开启CSP
    enableCSP: false,

    // 应用路由前缀
    domain: commonConfig.domain,

    // 页面模板路径
    appTemplate: '<APP_ROOT>/client/views/index.ejs',

    // routes file path
    appRoutes: '<APP_ROOT>/src/routes.js',

    // createStore file
    appCreateStore: '<APP_ROOT>/src/redux/createStore.js',

    // 默认启动端口
    appPort: 8080,

    // 多区域支持
    regions: commonConfig.regions,

    // mock api 文件路径
    mockFile: '<APP_ROOT>/server/mock.js',

    // middleware
    middlewareFile: '<APP_ROOT>/server/middleware.js',

    // 路径简写
    alias: commonConfig.alias,
};

export type ServerDefaultConf = typeof serverDefaultConf;
export type ServerConf = Partial<ServerDefaultConf>;

export default serverDefaultConf;

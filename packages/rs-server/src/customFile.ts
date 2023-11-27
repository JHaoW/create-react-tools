/**
 * @file 处理客户端配置文件
 * @author wjh90201@gmail.com
 */

import fs from 'fs-extra';
import {createRequire} from 'module';
import {runInThisContext} from 'vm';

// import {getServerConfig} from '@WJH/rs-config/dist/server/getServerConfig';
import logger from './logger';
import {deepNeedFile, resolveApp} from './path';

// const serverConfig = getServerConfig();

const readModuleFile = (filePath: string) => {
    // 创建一个commonjs模块加载器
    const require = createRequire(import.meta.url);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const exports = {};
    const module = {exports};

    // 创建一个上下文
    const context = {
        require,
        module,
        exports,
    };

    // 在当前上下文中执行文件内容
    runInThisContext(fileContents)(context);

    // 返回文件导出的内容
    return module.exports;
};

export const getCustomMiddlewares = (relativePath: string) => {
    const realPath = resolveApp(relativePath);
    if (fs.existsSync(realPath)) {
        const middlewareGenerator = readModuleFile(realPath);

        if (typeof middlewareGenerator === 'function') {
            // let customMiddlewares = middlewareGenerator(serverConfig);

            // if (!Array.isArray(customMiddlewares)) {
            //     customMiddlewares = [customMiddlewares];
            // }
            // return customMiddlewares;
        }

        logger.warn(
            `${realPath} must to export a function, Otherwise the file will be ignored.`,
        );
    }
    return [];
};

/**
 * @description 注册mock文件函数, 一个注册路由函数
 * @param relativePath 相对路径
 */
export const getMock = (relativePath: string) => {
    const realPath = resolveApp(relativePath);

    if (fs.existsSync(realPath)) {
        const getMockRoute = readModuleFile(realPath);

        if (typeof getMockRoute === 'function') {
            return getMockRoute;
        }
        logger.warn(
            `${realPath} must to export a function, Otherwise the file will be ignored.`,
        );
    }
};

export const envInject = (realPath: string) => {
    logger.info('开始注入环境变量...');
    // 将serverConfig - 服务启动配置 与conf - 环境变量注入信息
    // const config = {...serverConfig, ...serverConfig.conf};
    const config = {};

    const files = deepNeedFile(realPath, 'html');
    try {
        if (files.length) {
            // 按文件绝对路径数组读取文件ejs模板修改后重新写回,用作修改一些特殊字符
            files.forEach(file => {
                const content = fs.readFileSync(file).toString();
                fs.writeFileSync(
                    file,
                    content.replace(/<%= (.*?)%>/g, (target, match) => {
                        const val = config?.[match] ?? null;
                        return typeof val === 'object' ? JSON.stringify(val) : val;
                    }),
                );
            });
            logger.info('环境变量注入成功');
        }
        else {
            logger.warn('未检测到html文件, 环境变量注入失败');
        }
    }
    catch (error) {
        logger.error(error, '环境变量注入失败');
    }
};

/**
 * @file 获取本地的配置信息
 * @author wjh90201@gmail.com
 */

import fs from 'fs';
import path from 'path';
import {createRequire} from 'module';
import {runInThisContext} from 'vm';
import file from '../constants';

const isFile = (filePath: string) => fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();

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

const getClientConfigFilePath = (cwd: string, filename: string) => {
    if (!path.isAbsolute(cwd)) {
        throw Error(`"cwd" must be an absolute path. cwd: ${cwd}`);
    }
    if (!fs.existsSync(cwd)) {
        throw new Error(
            'Can\'t find a root directory while resolving a config file path.\n'
                + `Provided path to resolve: ${cwd}`,
        );
    }
    const projectConfig = path.resolve(cwd, filename);
    if (isFile(projectConfig)) {
        return projectConfig;
    }
};

const getClientConfig = () => {
    const configPathName = getClientConfigFilePath(process.cwd(), file.PROJECT_CONFIG);

    if (!configPathName) {
        return {};
    }
    try {
        const config = readModuleFile(configPathName);
        return config;
    }
    catch (ex) {
        return {};
    }
};

export default getClientConfig;

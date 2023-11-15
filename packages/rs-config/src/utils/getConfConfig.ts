/**
 * @file 获取conf配置
 * @author wjh90201@gmail.com
 */

import {existsSync} from 'fs';
import path from 'path';
import config from 'config';

export default () => {
    const appDir = process.cwd();
    // 优先读取环境变量，否则读取本地配置
    const configDir = process.env.NODE_CONFIG_DIR || './conf';
    const confPath = path.resolve(appDir, configDir);

    // 确保文件存在
    return existsSync(confPath)
        ? config.util.loadFileConfigs(confPath)
        : {};
};

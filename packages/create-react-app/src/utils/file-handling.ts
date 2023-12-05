/**
 * @file 文件相关操作
 * @author wjh90201@gmail.com
 */

import fs from 'fs';

/**
 * 判断目录是否有写权限
 * @param {string}dir 目录
 * @returns {boolean} 是否有写权限
 */
export const isWriteable = async dir => {
    try {
        await fs.promises.access(dir, (fs.constants || fs).W_OK);
        return true;
    }
    catch {
        return false;
    }
};

/**
 * 创建文件夹
 * @param {string} root 路径
 * @param {Record<string, any>} options 相关参数
 * @returns {Promise<string | undefined>}
 */
export const makeDir = (root, options = {recursive: true}) => fs.promises.mkdir(root, options);

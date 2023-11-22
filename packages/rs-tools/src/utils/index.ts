/**
 * @file utils
 * @author wjh90201@gmail.com
 */

import _ from 'lodash';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import {toolsConfig} from '../constants';

const appDir = process.cwd();

export const getHtmlContent = (filePath: string) => {
    const fileContent = readFileSync(filePath).toString();
    return fileContent.replace(/<%= '\\<%= (.*?)%\\>' %>/g, (_, match) => {
        const tempEnv = toolsConfig?.conf?.[match] ?? toolsConfig?.[match] ?? null;
        console.info(`环境变量: ${match} 注入成功`, tempEnv);
        return typeof tempEnv === 'object' ? JSON.stringify(tempEnv) : tempEnv;
    });
};

// 待验证，replace后已经是绝对路径了，resolve的作用是什么？
export const resolveApp = filePath => {
    const newPath = filePath.replace(/<APP_ROOT>/g, appDir);
    return resolve(appDir, newPath);
};

export const getType = value => Object.prototype.toString.call(value).slice(8, -1);

/**
 * 将数据中额<APP_ROOT>替换为项目根目录
 * @param {any} value
 * @returns {any} 替换后的数据
 */
export const deepReplace = value => {
    if (getType(value) === 'Array') {
        return _.map(value, deepReplace);
    }
    if (getType(value) === 'Object') {
        const tempMap = {};
        _.map(value, (val, key) => {
            tempMap[key] = deepReplace(val);
        });
        return tempMap;
    }
    return value;
};

/**
 * @file 路径解析
 * @author wjh90201@gmail.com
 */

import path from 'path';
import fs from 'fs-extra';

const appDir = process.cwd();

export const resolveApp = relativePath => {
    const realPath = relativePath.replace(/<APP_ROOT>/g, appDir);
    return path.resolve(appDir, realPath);
};

export const deepNeedFile = (realDir, fileType) => {
    const dirs = fs.readdirSync(realDir);

    return dirs.reduce((all, tempDir) => {
        const absolutePath = path.resolve(realDir, tempDir);
        const dirStats = fs.statSync(absolutePath);

        if (dirStats.isDirectory()) {
            return [...all, ...deepNeedFile(absolutePath, fileType)];
        }
        if (RegExp(`\\.${fileType}$`).test(tempDir)) {
            return [...all, absolutePath];
        }
        return all;
    }, []);
};

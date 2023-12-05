/**
 * @file 获取包管理器
 * @author wjh90201@gmail.com
 */

export type PackageManager = 'npm' | 'pnpm' | 'yarn';

function getPkgManager(): PackageManager {
    const userAgent = process.env.npm_config_user_agent || '';

    if (userAgent.startsWith('yarn')) {
        return 'yarn';
    }

    if (userAgent.startsWith('pnpm')) {
        return 'pnpm';
    }

    return 'npm';
}

export default getPkgManager;

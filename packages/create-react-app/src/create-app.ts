/**
 * @file 初始化项目
 * @author wjh90201@gmail.com
 */

import path from 'path';
import {green} from 'picocolors';

import {installTemplate} from './template';
import {isWriteable, makeDir} from './utils/file-handling';
import isFolderEmpty from './utils/is-folder-empty';
import {getOnline} from './utils/is-online';

const createApp = async ({
    appPath,
    packageManager,
}) => {
    const root = path.resolve(appPath);

    // 检测目录是否有写权限
    if (!(await isWriteable(path.dirname(root)))) {
        console.error(
            'The application path is not writable, please check folder permissions and try again.',
        );
        console.error(
            'It is likely you do not have write permissions for this folder.',
        );
        process.exit(1);
    }

    const appName = path.basename(root);

    await makeDir(root);
    if (!isFolderEmpty(root, appName)) {
        process.exit(1);
    }

    const useYarn = packageManager === 'yarn';
    const isOnline = !useYarn || (await getOnline());

    console.log(`Creating a new Next.js app in ${green(root)}.`);
    console.log();

    process.chdir(root);

    // install template
    await installTemplate({
        appName,
        root,
        packageManager,
        isOnline,
        // template,
        // mode,
    });

    console.log(`${green('Success!')} Created ${appName} at ${appPath}`);
    console.log();
};

export default createApp;

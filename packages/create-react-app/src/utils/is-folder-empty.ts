/**
 * @file 判断文件夹是否为空
 * @author wjh90201@gmail.com
 */

import fs from 'fs';
import path from 'path';
import {green, blue} from 'picocolors';

const VALID_FILES = [
    '.DS_Store',
    '.git',
    '.gitattributes',
    '.gitignore',
    '.gitlab-ci.yml',
    '.hg',
    '.hgcheck',
    '.hgignore',
    '.idea',
    '.npmignore',
    '.travis.yml',
    'LICENSE',
    'Thumbs.db',
    'docs',
    'mkdocs.yml',
    'npm-debug.log',
    'yarn-debug.log',
    'yarn-error.log',
    'yarnrc.yml',
    '.yarn',
];

const isFolderEmpty = (root: string, name: string): boolean => {
    const conflicts = fs
        .readdirSync(root)
        .filter(file => !VALID_FILES.includes(file))
        .filter(file => !/\.iml$/.test(file));

    if (conflicts.length > 0) {
        console.log(
            `The directory ${green(name)} contains files that could conflict:`,
        );
        console.log();
        conflicts.forEach(file => {
            try {
                const stats = fs.lstatSync(path.join(root, file));
                if (stats.isDirectory()) {
                    console.log(`  ${blue(file)}/`);
                }
                else {
                    console.log(`  ${file}`);
                }
            }
            catch {
                console.log(`  ${file}`);
            }
        });
        console.log();
        console.log(
            'Either try using a new directory name, or remove the files listed above.',
        );
        console.log();
        return false;
    }

    return true;
};

export default isFolderEmpty;

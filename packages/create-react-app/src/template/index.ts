/**
 * @file 处理模板
 * @author wjh90201@gmail.com
 */

import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import {cyan, bold} from 'picocolors';

import copy from '../utils/copy';
import install from '../utils/install';
// import pkg from '../../package.json';

export const getTemplateFile = ({template, mode, file}) => path.join(__dirname, template, mode, file);

export const installTemplate = async ({
    appName,
    root,
    packageManager,
    isOnline,
    // template,
    // mode,
}) => {
    console.log(bold(`Using ${packageManager}.`));

    // console.log('\nInitializing project with template:', template, '\n');
    // const templatePath = path.join(__dirname, template, mode);
    const templatePath = path.join(__dirname);
    const copySource = ['**'];

    await copy(copySource, root, {
        parents: true,
        cwd: templatePath,
        rename: name => {
            switch (name) {
            case 'gitignore':
            case 'eslintrc.yaml': {
                return `.${name}`;
            }
            case 'README-template.md': {
                return 'README.md';
            }
            default: {
                return name;
            }
            }
        },
    });

    /**
     * todo
     */
    const packageJson: any = {
        name: appName,
        version: '0.1.0',
        private: true,
        scripts: {
            dev: 'next dev',
            build: 'next build',
            start: 'next start',
        },
    };

    await fs.writeFile(
        path.join(root, 'package.json'),
        JSON.stringify(packageJson, null, 2) + os.EOL,
    );

    console.log('\nInstalling dependencies:');
    Object.keys(packageJson.dependencies).forEach(dependency => {
        console.log(`- ${cyan(dependency)}`);
    });

    console.log('\nInstalling devDependencies:');
    Object.keys(packageJson.devDependencies).forEach(dependency => {
        console.log(`- ${cyan(dependency)}`);
    });

    console.log();

    await install(packageManager, isOnline);
};

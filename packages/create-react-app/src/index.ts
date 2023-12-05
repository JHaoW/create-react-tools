#!/usr/bin/env node
/**
 * @file create app entry
 * @author wjh90201@gmail.com
 */

import {bold, cyan, green, red, yellow} from 'picocolors';
import commander from 'commander';
// import Conf from 'conf';
import checkForUpdate from 'update-check';
import fs from 'fs';
import path from 'path';
import prompts from 'prompts';

import packageJson from '../package.json';
import getPkgManager from './utils/get-pkg-manager';
import isFolderEmpty from './utils/is-folder-empty';
import validateNpmName from './utils/validate-pkg';

let projectPath: string = '';

const handleSigTerm = () => process.exit(0);

process.on('SIGINT', handleSigTerm);
process.on('SIGTERM', handleSigTerm);

const onPromptState = (state: any) => {
    if (state.aborted) {
        // If we don't re-enable the terminal cursor before exiting
        // the program, the cursor will remain hidden
        process.stdout.write('\x1B[?25h');
        process.stdout.write('\n');
        process.exit(1);
    }
};

const program: any = new commander.Command('c-cra')
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${green('<project-directory>')} [options]`)
    .action(name => {
        projectPath = name;
    })
    .option('--use-npm', 'Explicitly tell the CLI to bootstrap the application using npm')
    .option('--use-yarn', 'Explicitly tell the CLI to bootstrap the application using yarn')
    .option('--use-pnpm', 'Explicitly tell the CLI to bootstrap the application using pnpm')
    .option('--reset-preferences', 'Explicitly tell the CLI to reset any stored preferences')
    .allowUnknownOption()
    .parse(process.argv);

const packageManager = program.useNpm
    ? 'npm'
    : program.usePnpm
        ? 'pnpm'
        : program.useYarn
            ? 'yarn'
            : getPkgManager();

async function run(): Promise<void> {
    // const conf = new Conf({projectName: 'c-cra'});
    if (program.resetPreferences) {
        // conf.clear();
        console.log('Preferences reset successfully');
        return;
    }

    if (typeof projectPath === 'string') {
        projectPath = projectPath.trim();
    }

    // 调用命令未传参的情况下要求用户输入项目名
    if (!projectPath) {
        const res = await prompts({
            type: 'text',
            name: 'path',
            message: 'what is your project name?',
            initial: 'my-app',
            onState: onPromptState,
            validate: name => {
                const validation = validateNpmName(path.basename(path.resolve(name)));
                if (validation.valid) {
                    return true;
                }
                return `Invalid project name: ${validation.problems![0]}`;
            },
        });

        if (typeof res.path === 'string') {
            projectPath = res.path.trim();
        }
    }

    // 还是没有项目名的话，终止命令执行
    if (!projectPath) {
        console.log(
            '\nPlease specify the project directory:\n'
            + `  ${cyan(program.name())} ${green('<project-directory>')}\n`
            + 'For example:\n'
            + `  ${cyan(program.name())} ${green('my-next-app')}\n\n`
            + `Run ${cyan(`${program.name()} --help`)} to see all options.`,
        );
        process.exit(1);
    }

    // todo：增加包管理及渲染方式的提问

    const resolvedProjectPath = path.resolve(projectPath);
    const projectName = path.basename(resolvedProjectPath);

    // 对项目名进行检验，是否符合npm命名要求
    const {valid, problems} = validateNpmName(projectName);
    if (!valid) {
        console.error(
            `Could not create a project called ${red(
                `"${projectName}"`,
            )} because of npm naming restrictions:`,
        );

        problems!.forEach((p) => console.error(`    ${red(bold('*'))} ${p}`));
        process.exit(1);
    }

    const folderExists = fs.existsSync(resolvedProjectPath);

    if (folderExists && !isFolderEmpty(resolvedProjectPath, projectName)) {
        process.exit(1);
    }
}

const update = checkForUpdate(packageJson).catch(() => null);

// 更新本地版本
async function notifyUpdate(): Promise<void> {
    try {
        const res = await update;
        if (res?.latest) {
            const updateMessage = packageManager === 'yarn'
                ? `yarn global add ${packageJson.name}`
                : packageManager === 'pnpm'
                    ? `pnpm add -g ${packageJson.name}`
                    : `npm i -g ${packageJson.name}`;

            console.log(
                `${yellow(bold(`A new version of \`${packageJson.name}\` is available!`))
                }\n`
            + `You can update by running: ${
                cyan(updateMessage)
            }\n`,
            );
        }
        process.exit();
    }
    catch {
        // ignore error
    }
}

run()
    .then(notifyUpdate)
    .catch(async (reason) => {
        console.log();
        console.log('Aborting installation.');
        if (reason.command) {
            console.log(`  ${cyan(reason.command)} has failed.`);
        }
        else {
            console.log(
                `${red('Unexpected error. Please report it as a bug:')}\n`,
                reason,
            );
        }
        console.log();

        await notifyUpdate();

        process.exit(1);
    });

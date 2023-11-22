/**
 * @file 生产环境编译
 * @author wjh90201@gmail.com
 */

import chalk from 'chalk';
import webpack from 'webpack';
import webpackProdConfig from '../config/webpack.prod.config';

// 开始编译
console.time('webpackbuild done');
console.log(chalk.greenBright('开始编译'));

webpack(webpackProdConfig, (err, stats) => {
    if (err) {
        console.error(err.stack || err);
        if (err.message) {
            console.error(chalk.redBright(err.message));
        }
        return;
    }

    const info = stats?.toJson();

    if (stats?.hasErrors()) {
        console.error(chalk.redBright('errors:', info?.errors?.map(x => x.message).join('\n')));
    }

    if (stats?.hasWarnings()) {
        console.warn(chalk.yellow('warnings:', info?.warnings?.map(x => x.message).join('\n')));
    }

    // 编译完成
    console.log(chalk.greenBright('编译完成'));
    console.timeEnd('webpackbuild done');
});

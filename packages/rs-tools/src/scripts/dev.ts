/**
 * @file dev编译
 * @author wjh90201@gmail.com
 */

import chalk from 'chalk';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import webpackConfig from '../config/webpack.dev.config';

const compiler = webpack(webpackConfig);
const devServerOptions = {...webpackConfig.devServer};

const runServer = async () => {
    try {
        const server = new WebpackDevServer(devServerOptions, compiler);
        console.log(chalk.greenBright('Starting server...'));
        await server.start();
    }
    catch (error) {
        console.log(chalk.redBright('--------配置有误,请检查dev webpack配置---------'));
    }
};

runServer();

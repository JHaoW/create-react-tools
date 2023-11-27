/**
 * @file 日志模块封装
 * @author wjh90201@gmail.com
 */

import fs from 'fs-extra';
import path from 'path';
import config from 'config';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

type LogArgs = [any, any] | [any] | [];

const level = config.get('logging.level') ?? 'debug';
// const timestamp = () => moment().format('YYYY-MM-DD HH:mm:ss');
const transports: any[] = [];

// const formatter = ({
//     colorize,
//     level,
//     timestamp,
//     meta,
//     message,
// }) => {
//     let out = '';
//     out += colorize === 'all' ? winston.config.colorize(level, timestamp()) : timestamp();
//     out += ' ';
//     out += colorize === 'all' || colorize === 'level' || colorize === true
//         ? winston.config.colorize(level, level.toUpperCase())
//         : level.toUpperCase();
//     out += ' ';
//     const requestId = meta && meta.requestId || 'default';
//     out += colorize === 'all' ? winston.config.colorize(level, requestId) : requestId;
//     out += ' ';
//     out += colorize === 'all' ? winston.config.colorize(process.pid, requestId) : process.pid;
//     out += ' ';
//     out += colorize === 'all' || colorize === 'message' ? winston.config.colorize(level, message) : message;
//     return out;
// };

if (config.get('logging.console.enabled') ?? true) {
    transports.push(new winston.transports.Console({
        level,
        // colorize: 'level',
        // prettyPrint: true,
        // json: false,
        // timestamp,
    }));
}
if (config.getOrElse('logging.file.enabled', false)) {
    const logFile = path.resolve(config.get('logging.file.filename'));
    const maxFiles = config.getOrElse('logging.file.backups', 14);

    fs.ensureDirSync(path.dirname(logFile));
    transports.push(new DailyRotateFile({
        level,
        // colorize: false,
        filename: logFile,
        datePattern: '.yyyy-MM-dd',
        // prepend: false,
        zippedArchive: true,
        maxFiles,
        json: false,
        // timestamp,
        // formatter,
    }));

    if (level !== 'error') {
        const logDir = path.dirname(logFile);
        const logExt = path.extname(logFile);
        const logBaseName = path.basename(logFile);

        transports.push(new (winston.transports.File)({
            level: 'error',
            // colorize: false,
            filename: path.join(logDir, `${logBaseName.replace(logExt, '')}.error${logExt}`),
            zippedArchive: true,
            maxsize: 1024 * 1024 * 10,
            maxFiles,
            // json: false,
            // timestamp,
            // formatter,
            tailable: true,
        }));
    }
}

const winLog = new winston.Logger();

const wrapLevel = level => (message, ...args: LogArgs) => winLog.log(level, message, ...args);

const logger = {
    error: wrapLevel('error'),
    warn: wrapLevel('warn'),
    info: wrapLevel('info'),
    http: wrapLevel('http'),
    verbose: wrapLevel('verbose'),
    debug: wrapLevel('debug'),
    silly: wrapLevel('silly'),
};

export default logger;

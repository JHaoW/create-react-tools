/**
 * @file start server
 * @author wjh90201@gmail.com
 */

import path from 'path';
import fs from 'fs-extra';

import logger from './logger';
import KoaServer from './koaServer';
import {envInject, getCustomMiddlewares} from './customFile';
import {resolveApp} from './path';

const serverConfig: any = {};

const main = () => {
    const {domain, appPort, middlewareFile} = serverConfig;

    const port = process.env.NODE_PORT || appPort || 8888;

    envInject(resolveApp('dist'));

    const koaServer = new KoaServer({port, logger});

    koaServer.addMiddlewares(getCustomMiddlewares(middlewareFile));

    koaServer.addStaticResources([
        {prefix: domain || '/', path: resolveApp('client/assets')},
        {prefix: domain || '/', path: resolveApp('dist')},
    ]);

    const router = koaServer.addRouter();
    router.get('/(.*)', ctx => {
        const htmlFileString = fs.readFileSync(path.resolve(resolveApp('dist'), 'index.html')).toString();
        ctx.type = 'text/html';
        ctx.body = htmlFileString;
    });
};

main();

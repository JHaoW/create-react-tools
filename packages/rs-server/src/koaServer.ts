/**
 * @file koa server
 * @author wjh90201@gmail.com
 */

import Koa from 'koa';
import koaStatic from 'koa-static';
import koaMount from 'koa-mount';
import koaCompose from 'koa-compose';
import Router from '@koa/router';

interface StaticResource {
    prefix: string;
    path: string;
}

class KoaServer {
    private app: Koa;
    private server: import('http').Server;

    constructor({port = 8888, host = '0.0.0.0', logger}) {
        this.app = new Koa();
        this.server = this.startServer(port, host, logger);
        this.addTestConnect();
    }

    private startServer(port: number, host: string, logger: Console) {
        const server = this.app.listen(port, host);

        server.on('listening', () => {
            logger.info(`server is running at ${host}:${port}`);
        });
        server.on('error', err => {
            logger.error('server is error');
            if (typeof err === 'function') {
                logger.error(err());
            }
            else {
                logger.error(err);
            }
            process.exit(1);
        });

        return server;
    }

    addMiddlewares(middlewares: Koa.Middleware[]) {
        if (middlewares.length) {
            this.app.use(koaCompose(middlewares));
        }
    }

    addRouter() {
        const router = new Router();
        this.app.use(router.routes());
        return router;
    }

    addStaticResources(staticList: StaticResource[]) {
        staticList.forEach(item => {
            this.app.use(koaMount(item.prefix, koaStatic(item.path)));
        });
    }

    addTestConnect() {
        this.app.use(async (ctx, next) => {
            if (ctx.method === 'GET' && ctx.path === '/ping') {
                ctx.body = 'pong';
            }
            else {
                await next();
            }
        });
    }
}

export default KoaServer;

/**
 * @file
 * @author wjh90201@gmail.com
 */

import dns from 'dns';
import url from 'url';
import {execSync} from 'child_process';

const getProxy = (): string | undefined => {
    if (process.env.https_proxy) {
        return process.env.https_proxy;
    }

    try {
        const httpsProxy = execSync('npm config get https-proxy').toString().trim();
        return httpsProxy !== 'null' ? httpsProxy : undefined;
    }
    catch {
        return undefined;
    }
};

export const getOnline = () => new Promise(resolve => {
    dns.lookup('registry.yarnpkg.com', registryErr => {
        if (!registryErr) {
            return resolve(true);
        }

        const proxy = getProxy();
        if (!proxy) {
            return resolve(false);
        }

        const {hostname} = url.parse(proxy);
        if (!hostname) {
            return resolve(false);
        }

        dns.lookup(hostname, proxyErr => {
            resolve(proxyErr === null);
        });
    });
});

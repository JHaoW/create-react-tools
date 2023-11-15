/**
 * @file 聚合rs-server的配置
 * @author wjh90201@gmail.com
 */

import {merge} from 'lodash';
import getClientConfig from '../utils/getClientConfig';
import getConfConfig from '../utils/getConfConfig';
import defaultServerConfig from './rs-server.config';

const getRsServerConfig = () => {
    const envConf = getConfConfig();

    const {server, ...restParams} = getClientConfig() as Record<string, any>;

    return merge({}, defaultServerConfig, server, restParams, {conf: envConf});
};

export default getRsServerConfig;

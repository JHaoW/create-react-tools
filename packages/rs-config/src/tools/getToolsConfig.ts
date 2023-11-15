/**
 * @file 聚合rs-tools配置
 * @author wjh90201@gmail.com
 */

import {merge} from 'lodash';
import getClientConfig from '../utils/getClientConfig';
import getConfConfig from '../utils/getConfConfig';
import defaultToolsConfig from './rs-tools.config';

const getRsToolsConfig = () => {
    // 读取json5环境变量
    const envConf = getConfConfig();

    const {alias, tools, ...restParams} = getClientConfig() as Record<string, any>;

    return merge({}, defaultToolsConfig, tools, restParams, {
        webpack: {alias},
        conf: envConf,
    });
};

export default getRsToolsConfig;

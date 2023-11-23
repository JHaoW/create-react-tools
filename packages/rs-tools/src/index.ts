/**
 * @file tools
 * @author wjh90201@gmail.com
 */

// import {ToolsConf, ServerConf} from '@WJH/rs-config';

export interface PackageConfigType {
    title: string;
    domain: string;
    alias: Record<string, string>;
    tools: any;
    server: any;
}

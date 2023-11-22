/**
 * @file babel 配置
 * @author wjh90201@gmail.com
 */

export default {
    presets: [
        [
            // 1. 将高版本代码编译成符合浏览器需求的版本
            '@babel/preset-env',
            {
                useBuiltIns: 'entry',
                corejs: '3',
                targets: 'last 2 versions, not ie <= 8, not dead',
                loose: true,
            },
        ],
        [
            // 2. 编译jsx代码，同时在编译时自动注入React到环境中即自动添加 import React from 'react'
            '@babel/preset-react',
            {
                runtime: 'automatic',
            },
        ],
        // 3. 编译ts代码
        '@babel/preset-typescript',
    ],
    plugins: [],
};

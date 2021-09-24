/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-07-10 18:03:45
 * @LastEditors: Roy
 * @LastEditTime: 2021-07-22 12:09:09
 * @Deprecated: 否
 * @FilePath: /roy-cli-server/app/io/middleware/auth.js
 */
'use strict';

const helper = require("../../extend/helper");
const REDIST_PREFIX = 'cloudbuild';

const { createCloudBuildTask } = require('../../models/CloudBuildTask');

module.exports = () => {
    return async (ctx, next) => {
        const { app, socket, logger } = ctx;
        const { id } = socket;
        const { redis } = app;
        const task = id;
        const query = socket.handshake.query;
        try {
            socket.emit(id, helper.parseMsg('connect', {
                type: 'connect',
                message: '云构建服务链接成功'
            }));
            let hasTask = await redis.get(`${REDIST_PREFIX}:${id}`);
            if (!hasTask) {
                await redis.set(`${REDIST_PREFIX}:${id}`, JSON.stringify(query));
            }
            hasTask = await redis.get(`${REDIST_PREFIX}:${id}`);
            logger.info('query', hasTask);
            await next();
            //清除换成文件
            const cloudbuildTask = await createCloudBuildTask(ctx, app);
            await cloudbuildTask.clean();
            console.log('disconnect!');
        } catch (e) {
            logger.error('build error', e.message);
            //清除换成文件
            const cloudbuildTask = await createCloudBuildTask(ctx, app);
            await cloudbuildTask.clean();
        }
    };
};

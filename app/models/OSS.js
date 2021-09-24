/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-07-21 22:13:49
 * @LastEditors: Roy
 * @LastEditTime: 2021-07-22 11:45:51
 * @Deprecated: 否
 * @FilePath: /roy-cli-server/app/models/OSS.js
 */
'use strict';

const config = require('../../config/db');


class OSS {
    constructor(bucket) {
        this.oss = require('ali-oss')({
            accessKeyId: config.OSS_ACCESS_KEY,
            accessKeySecret: config.OSS_ACCESS_SECRET_KEY,
            bucket,
            region: config.OSS_REGION,
        })
    }
    async list(prefix) {
        const ossFileList = await this.oss.list({
            prefix,
        });
        if (ossFileList && ossFileList.objects) {
            return ossFileList.objects;
        }
        return [];
    }

    async put(object, localPath, options = {}) {
        await this.oss.put(object, localPath, options);
    }
}

module.exports = OSS;

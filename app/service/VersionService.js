/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-08-08 15:07:44
 * @LastEditors: Roy
 * @LastEditTime: 2021-08-08 15:23:17
 * @Deprecated: 否
 * @FilePath: /roy-cli-server/app/service/VersionService.js
 */

'use strict';

class VersionService {
    constructor(app) {
        this.app = app;
        this.name = 'version_test';//表名
    }
    async insert(data) {
        const res = await this.app.mysql.insert(this.name, data);
        if (res.affectedRows > 0) {
            return true;
        }
        return false;
    }
    async queryOne(query) {
        const data = await this.app.mysql.select(this.name, {
            where: query,
        })
        if (data && data.length > 0) {
            return data[0]
        }
        return null
    }
    async update(data, query) {
        const res = await this.app.mysql.update(this.name, data, {
            where: query,
        });
        if (res.affectedRows > 0) {
            return true;
        }
        return false;
    }
}

module.exports = VersionService;
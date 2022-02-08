/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-08-08 14:42:23
 * @LastEditors: Roy
 * @LastEditTime: 2022-02-08 11:07:26
 * @Deprecated: 否
 * @FilePath: /code-robot-cli-server/app/service/ComponentService.js
 */
'use strict';

class ComponentService {
    constructor(app) {
        this.app = app;
        this.name = 'component';//表名
    }
    async insert(data) {
        const res = await this.app.mysql
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
}

module.exports = ComponentService;
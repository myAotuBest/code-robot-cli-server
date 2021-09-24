/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-08-08 14:42:23
 * @LastEditors: Roy
 * @LastEditTime: 2021-08-08 14:59:48
 * @Deprecated: 否
 * @FilePath: /roy-cli-server/app/service/ComponentService.js
 */
'use strict';

class ComponentService {
    constructor(app) {
        this.app = app;
        this.name = 'component_test';//表名
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
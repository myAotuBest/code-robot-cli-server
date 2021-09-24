/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-07-10 22:41:02
 * @LastEditors: Roy
 * @LastEditTime: 2021-07-10 22:53:34
 * @Deprecated: 否
 * @FilePath: /imooc-cli-server/app/extend/helper.js
 */
'use strict';


module.exports = {
    parseMsg(action, payload = {}, metadata = {}) {
        const meta = Object.assign({}, {
            timestamp: Date.now()
        }, metadata);

        return {
            meta,
            data: {
                action,
                payload
            }
        }
    }
}
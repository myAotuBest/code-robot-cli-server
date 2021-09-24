/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-07-10 18:03:53
 * @LastEditors: Roy
 * @LastEditTime: 2021-07-10 23:02:09
 * @Deprecated: 否
 * @FilePath: /imooc-cli-server/app/io/middleware/filter.js
 */

'use strict';

module.exports = () => {
    return async (ctx, next) => {

        await next();
        console.log('packet response!');
    };
};

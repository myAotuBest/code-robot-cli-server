/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-07-22 08:45:50
 * @LastEditors: Roy
 * @LastEditTime: 2021-07-22 08:45:50
 * @Deprecated: 否
 * @FilePath: /roy-cli-server/app/utils/request.js
 */
'use strict';

function success(message, data) {
    return {
        code: 0,
        message,
        data,
    };
}

function failed(message, data) {
    return {
        code: -1,
        message,
        data,
    };
}

module.exports = {
    success,
    failed,
};
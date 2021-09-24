/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2020-12-30 10:39:30
 * @LastEditors: Roy
 * @LastEditTime: 2021-08-08 13:55:34
 * @Deprecated: 否
 * @FilePath: /roy-cli-server/config/plugin.js
 */
'use strict';

exports.io = {
  enable: true,
  package: 'egg-socket.io',
};
exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.mysql = {
  enable: true,
  package: 'egg-mysql',
}
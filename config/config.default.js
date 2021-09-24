/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2020-12-30 10:39:30
 * @LastEditors: Roy
 * @LastEditTime: 2021-08-08 14:07:43
 * @Deprecated: 否
 * @FilePath: /roy-cli-server/config/config.default.js
 */
/* eslint valid-jsdoc: "off" */

'use strict';

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB
} = require('./db')

//local
const REDIS_PORT = 6379;
const REDIS_HOST = '127.0.0.1';
const REDIS_PWD = '';

//阿里云
// const REDIS_PORT = 6379;
// const REDIS_HOST = 'r-bp1liwbvhzct8vjz0lpd.redis.rds.aliyuncs.com';
// const REDIS_PWD = 'test_imooc:Imooc123456';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1609077478115_7491';

  // add your middleware config here
  config.middleware = [];
  // add WebSocket Server config
  config.io = {
    namespace: {
      '/': {
        connectionMiddleware: ['auth'],
        packetMiddleware: ['filter'],
      },
    },
  };
  config.redis = {
    client: {
      port: REDIS_PORT,          // Redis port
      host: REDIS_HOST,   // Redis host
      password: REDIS_PWD,
      db: 0,
    },
  };
  config.mysql = {
    client: {
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PWD,
      database: MYSQL_DB,
    },
    app: true,
    agent: false,
  }
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};

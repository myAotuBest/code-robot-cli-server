/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2020-12-30 10:39:30
 * @LastEditors: Roy
 * @LastEditTime: 2021-09-24 16:25:29
 * @Deprecated: 否
 * @FilePath: /code-robot-cli-server/config/db.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const userHome = require('user-home');
/** MONGODB **/
const mongodbUrl = 'mongodb://sam:123456@localhost:27017/imooc-cli';
const mongodbDbName = 'imooc-cli';

/*OSS */

const OSS_ACCESS_KEY = 'LTAI5tLNC9xtRY2rizyfPYck';
const OSS_ACCESS_SECRET_KEY = fs.readFileSync(path.resolve(userHome, '.code-robot-cli', 'oss_access_secret_key')).toString().trim();
const OSS_PROD_BUCKET = 'roy-cli-sync';
const OSS_DEV_BUCKET = 'roy-cli-sync-dev';
const OSS_REGION = 'oss-cn-qingdao'
const OSS_COMPONENT_BUCKET = 'roy-component';
/* mysql */

const MYSQL_HOST = "rm-bp188055550b15tn90o.mysql.rds.aliyuncs.com"
const MYSQL_PORT = "3306";
const MYSQL_USER = "imooc";
const MYSQL_PWD = fs.readFileSync(path.resolve(userHome, '.code-robot-cli', 'mysql_password')).toString().trim();
const MYSQL_DB = 'imooc_cli';

module.exports = {
  mongodbUrl,
  mongodbDbName,
  OSS_ACCESS_KEY,
  OSS_ACCESS_SECRET_KEY,
  OSS_PROD_BUCKET,
  OSS_DEV_BUCKET,
  OSS_REGION,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB,
  OSS_COMPONENT_BUCKET
};

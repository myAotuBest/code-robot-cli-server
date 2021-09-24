/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2020-12-30 10:39:30
 * @LastEditors: Roy
 * @LastEditTime: 2021-07-23 17:33:57
 * @Deprecated: 否
 * @FilePath: /roy-cli-server/app/controller/project.js
 */
'use strict';

const Controller = require('egg').Controller;
const OSS = require('../models/OSS');
const config = require('../../config/db');
const { success, failed } = require('../utils/request');
// const mongo = require('../utils/mongo');

class ProjectController extends Controller {
  // 获取项目/组件的代码模板
  async getTemplate() {
    const { ctx } = this;
    // const data = await mongo().query('project');
    ctx.body = success('获取成功',
      [{
        name: 'vue3标准模板',
        npmName: 'roy-cli-dev-template',
        type: 'normal',
        installCommand: 'npm install --registry=https://registry.npm.taobao.org/',
        startCommand: 'npm run serve',
        version: '1.0.0',
        tag: ['project'],
        ignore: ['**/public/**']
      }, {
        name: 'vue2管理后台模板',
        npmName: 'roy-cli-dev-template-vue-element-admin',
        type: 'normal',
        installCommand: 'npm install --registry=https://registry.npm.taobao.org/',
        startCommand: 'npm run serve',
        version: '1.0.0',
        tag: ['project'],
        ignore: ['**/public/**']
      }, {
        name: 'vue2自定义模板',
        npmName: 'imooc-cli-dev-template-custom-vue2',
        type: 'custom',
        installCommand: 'npm install --registry=https://registry.npm.taobao.org/',
        startCommand: 'npm run serve',
        version: '1.0.0',
        tag: ['project'],
        ignore: ['**/public/**']
      }, {
        name: '组件库模板',
        npmName: 'roy-cli-dev-lego-components',
        type: 'normal',
        installCommand: 'npm install --registry=https://registry.npm.taobao.org/',
        startCommand: 'npm run serve',
        version: '1.0.0',
        tag: ['component'],
        ignore: ['**/public/**', '**.png']
      }, {
        name: '通用Vue3组件库模板',
        npmName: 'roy-cli-dev-components',
        type: 'normal',
        installCommand: 'npm install --registry=https://registry.npm.taobao.org/',
        startCommand: 'npm run serve',
        version: '1.0.3',
        tag: ['component'],
        ignore: ['**/public/**', '**.png'],
        "buildPath": "dist",
        "examplePath": "examples"
      }])
  }
  async getOSSProject() {
    const { ctx } = this;
    let ossProjectType = ctx.query.type;
    const ossProjectName = ctx.query.name;
    if (!ossProjectName) {
      ctx.body = failed('项目名称不存在');
      return;
    }
    if (!ossProjectType) {
      ossProjectType = 'prod';
    }
    let oss;
    if (ossProjectType === 'prod') {
      oss = new OSS(config.OSS_PROD_BUCKET);
    } else {
      oss = new OSS(config.OSS_DEV_BUCKET);
    }
    if (oss) {
      const fileList = await oss.list(ossProjectName);
      ctx.body = success('获取项目文件成功', fileList);
    } else {
      ctx.body = success('获取项目文件失败');
    }
  }
  async getOSSFile() {
    const { ctx } = this;
    const dir = ctx.query.name;
    const file = ctx.query.file;
    let ossProjectType = ctx.query.type;
    if (!dir || !file) {
      ctx.body = failed('请提供OSS文件名称');
      return;
    }
    if (!ossProjectType) {
      ossProjectType = 'prod';
    }
    let oss;
    if (ossProjectType === 'prod') {
      oss = new OSS(config.OSS_PROD_BUCKET);
    } else {
      oss = new OSS(config.OSS_DEV_BUCKET);
    }
    if (oss) {
      const fileList = await oss.list(dir);
      const fileName = `${dir}/${file}`;
      const finalFile = fileList.find(item => item.name === fileName);
      ctx.body = success('获取项目文件成功', finalFile);
    } else {
      ctx.body = failed('获取项目文件失败');
    }
  }
  async getRedis() {
    const { ctx, app } = this;
    ctx.body = await app.redis.get('test');
  }
}

module.exports = ProjectController;

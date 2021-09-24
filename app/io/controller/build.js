/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-07-10 18:02:56
 * @LastEditors: Roy
 * @LastEditTime: 2021-07-22 22:35:09
 * @Deprecated: 否
 * @FilePath: /roy-cli-server/app/io/controller/build.js
 */
'use strict';

const { createCloudBuildTask } = require('../../models/CloudBuildTask');
// const helper = require('../../extend/helper');
// const REDIST_PREFIX = 'cloudbuild';

const { FAILED } = require('../../const');

// async function createCloudBuildTask(ctx, app) {
//   const { socket } = ctx;
//   const client = socket.id;
//   const redisKey = `${REDIST_PREFIX}:${client}`;
//   const redisTask = await app.redis.get(redisKey);
//   const task = JSON.parse(redisTask);
//   socket.emit('build', helper.parseMsg('create task', {
//     message: '创建云构建任务',
//   }));
//   console.log('redisTask', redisTask);
//   return new CloudBuildTask({
//     repo: task.repo,
//     name: task.name,
//     branch: task.branch,
//     version: task.version,
//     buildCmd: task.buildCmd,
//     prod: task.prod,
//   }, ctx);
// }

async function prepare(cloudBuildTask, socket, helper) {
  socket.emit('build', helper.parseMsg('prepare', {
    message: '开始执行构建前准备工作',
  }));
  const preparRes = await cloudBuildTask.prepare();
  if (!preparRes || preparRes.code === FAILED) {
    socket.emit('build', helper.parseMsg('prepare failed', {
      message: '开始执行构建前准备工作失败，失败原因：' + preparRes ? preparRes.message : '无',
    }));
    return;
  }
  socket.emit('build', helper.parseMsg('prepare success', {
    message: '开始执行构建前准备工作成功',
  }));
}

async function download(cloudBuildTask, socket, helper) {
  socket.emit('build', helper.parseMsg('download repo', {
    message: '开始现在源码',
  }));
  const downloadRes = await cloudBuildTask.download();
  if (!downloadRes || downloadRes.code === FAILED) {
    socket.emit('build', helper.parseMsg('download failed', {
      message: '源码下载失败，失败原因：' + downloadRes ? downloadRes.message : '无',
    }));
    return;
  }
  socket.emit('build', helper.parseMsg('download success', {
    message: '源码下载成功',
  }));
}

async function install(cloudBuildTask, socket, helper) {
  socket.emit('build', helper.parseMsg('install', {
    message: '开始安装依赖',
  }));
  const installRes = await cloudBuildTask.install();
  if (!installRes || installRes.code === FAILED) {
    socket.emit('build', helper.parseMsg('install failed', {
      message: '安装依赖失败',
    }));
    return;
  }
  socket.emit('build', helper.parseMsg('install', {
    message: '安装依赖成功',
  }));
}
async function build(cloudBuildTask, socket, helper) {
  socket.emit('build', helper.parseMsg('build', {
    message: '开始启动云构建',
  }));
  const buildRes = await cloudBuildTask.build();
  if (!buildRes || buildRes.code === FAILED) {
    socket.emit('build', helper.parseMsg('build failed', {
      message: '云构建任务执行失败',
    }));
    return;
  }
  socket.emit('build', helper.parseMsg('build', {
    message: '云构建任务执行成功',
  }));
}
async function prePublish(cloudBuildTask, socket, helper) {
  socket.emit('build', helper.parseMsg('pre-publish', {
    message: '开始发布前检查',
  }));
  const prePublishRes = await cloudBuildTask.prePublish();
  if (!prePublishRes || prePublishRes.code === FAILED) {
    socket.emit('build', helper.parseMsg('pre-publish failed', {
      message: '发布前检查失败，失败原因：' + (prePublishRes && prePublishRes.message ? prePublishRes.message : '未知'),
    }));
    throw new Error('发布终止');
  }
  socket.emit('build', helper.parseMsg('pre-publish', {
    message: '发布前检查通过',
  }));
}

async function publish(cloudBuildTask, socket, helper) {
  socket.emit('build', helper.parseMsg('publish', {
    message: '开始发布',
  }));
  const buildRes = await cloudBuildTask.publish();
  if (!buildRes) {
    socket.emit('build', helper.parseMsg('publish failed', {
      message: '发布失败',
    }));
    return;
  }
  socket.emit('build', helper.parseMsg('publish', {
    message: '发布成功',
  }));
}

module.exports = app => {
  class Controller extends app.Controller {
    async index() {
      const { ctx, app } = this;
      const { socket, helper } = ctx;
      const cloudbuildTask = await createCloudBuildTask(ctx, app);
      try {
        await prepare(cloudbuildTask, socket, helper);
        await download(cloudbuildTask, socket, helper);
        await install(cloudbuildTask, socket, helper);
        await build(cloudbuildTask, socket, helper);
        await prePublish(cloudbuildTask, socket, helper);
        await publish(cloudbuildTask, socket, helper);
        socket.emit('build', helper.parseMsg('build success', {
          message: `云构建成功`
        }))
        socket.disconnect();
      } catch (error) {
        socket.emit('build', helper.parseMsg('error', {
          message: '云构建失败，失败原因:' + error.message,
        }));
        socket.disconnect();
      }
    }
  }
  return Controller;
};

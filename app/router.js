/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2020-12-30 10:39:30
 * @LastEditors: Roy
 * @LastEditTime: 2021-08-08 14:29:08
 * @Deprecated: 否
 * @FilePath: /roy-cli-server/app/router.js
 */
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/project/template', controller.project.getTemplate);
  router.get('/project/oss', controller.project.getOSSProject);
  router.get('/oss/get', controller.project.getOSSFile);
  router.get('/redis/test', controller.project.getRedis);

  router.resources('components', '/api/v1/components', controller.v1.components)


  // app.io.of('/')
  app.io.route('build', app.io.controller.build.index);

};


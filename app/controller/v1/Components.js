/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-08-08 14:29:31
 * @LastEditors: Roy
 * @LastEditTime: 2021-08-22 14:30:01
 * @Deprecated: 否
 * @FilePath: /roy-cli-server/app/controller/v1/Components.js
 */
'use strict';
const Controller = require('egg').Controller;
const axios = require('axios');
const { decode } = require('js-base64');
const constants = require('../../const')
const { success, failed } = require('../../utils/request')
const ComponentService = require('../../service/ComponentService')
const VersionService = require('../../service/VersionService')
const { formatName } = require('../../utils');
const ComponentTask = require('../../models/ComponentTask')

class ComponentsController extends Controller {
    async index() {
        const { ctx, app } = this;
        const { name } = ctx.query;
        const andWhere = name ? `AND c.name LIKE '%${name}%'` : '';
        const sql = `SELECT c.id, c.name, c.classname, c.description, c.npm_name, c.npm_version, c.git_type, c.git_remote, c.git_owner, c.git_login, c.create_dt, c.update_dt, v.version, v.build_path, v.example_path, v.example_list
FROM component_test AS c
LEFT JOIN version_test AS v ON c.id = v.component_id
WHERE c.status = 1 AND v.status = 1 ${andWhere}
ORDER BY c.create_dt, v.version DESC`;
        const result = await app.mysql.query(sql);
        const components = [];
        result.forEach(component => {
            let hasComponent = components.find(item => item.id === component.id);
            if (!hasComponent) {
                hasComponent = {
                    ...component,
                };
                delete hasComponent.version;
                delete hasComponent.build_path;
                delete hasComponent.example_path;
                delete hasComponent.example_list;
                hasComponent.versions = [];
                components.push(hasComponent);
                hasComponent.versions.push({
                    version: component.version,
                    build_path: component.build_path,
                    example_path: component.example_path,
                    example_list: component.example_list,
                });
            } else {
                hasComponent.versions.push({
                    version: component.version,
                    build_path: component.build_path,
                    example_path: component.example_path,
                    example_list: component.example_list,
                });
            }
        });
        ctx.body = components;
        // {
        //     id: 10,
        //         name: "@imooc-cli-dev/component-test2",
        //             classname: "@imooc-cli-dev/component-test2",
        //                 description: "component test2",
        //                     npm_name: "imooc-cli-dev-components",
        //                         npm_version: "1.0.5",
        //                             git_type: "gitee",
        //                                 git_remote: "git@gitee.com:sam9831/imooc-cli-dev_component-test2.git",
        //                                     git_owner: "user",
        //                                         git_login: "sam9831",
        //                                             create_dt: "1627605731703",
        //                                                 update_dt: "1627605731703",
        //                                                     versions: [
        //                                                         {
        //                                                             version: "1.0.0",
        //                                                             build_path: "dist",
        //                                                             example_path: "examples/dist",
        //                                                             example_list: "["index.html"]"
        //     }
        //                                                     ]
        // },
    }
    async show() {
        const { ctx, app } = this;
        const id = ctx.params.id;
        const results = await app.mysql.select('component_test', {
            where: { id },
        });
        if (results && results.length > 0) {
            const component = results[0];
            component.versions = await app.mysql.select('version_test', {
                where: { component_id: id },
                orders: [['version', 'desc']],
            });
            // gitee: https://gitee.com/api/v5/repos/{owner}/{repo}/contents(/{path})
            // github: https://api.github.com/repos/{owner}/{repo}/{path}
            let readmeUrl;
            const name = formatName(component.classname);
            if (component.git_type === 'gitee') {
                readmeUrl = `https://gitee.com/api/v5/repos/${component.git_login}/${name}/contents/README.md`;
            } else {
                readmeUrl = `https://api.github.com/repos/${component.git_login}/${name}/readme`;
            }
            const readme = await axios.get(readmeUrl);
            let content = readme.data && readme.data.content;
            if (content) {
                content = decode(content);
                if (content) {
                    component.readme = content;
                }
            }
            ctx.body = component;
        } else {
            ctx.body = {};
        }
    }
    async create() {
        const { ctx, app } = this;
        const { component, git } = ctx.request.body;
        const timestamp = new Date().getTime();
        //添加组件信息
        const componentData = {
            name: component.name,
            classname: component.classname,
            description: component.description,
            npm_name: component.npmName,
            npm_version: component.npmVersion,
            git_type: git.type,
            git_remote: git.remote,
            git_owner: git.owner,
            git_login: git.login,
            status: constants.STATUS.ON,
            create_dt: timestamp,
            create_by: git.login,
            update_dt: timestamp,
            update_by: git.login,
        }
        let componentId;
        const componentService = new ComponentService(app);
        const haveComponentInDB = await componentService.queryOne({
            classname: componentData.classname,
        });
        if (!haveComponentInDB) {
            componentId = await componentService.insert(componentData);
        } else {
            componentId = haveComponentInDB.id;
        }
        if (!componentId) {
            ctx.body = failed('添加组件时候把');
            return;
        }
        //添加组件的多版本信息
        const versonData = {
            component_id: componentId,
            version: git.version,
            build_path: component.buildPath,
            example_path: component.examplePath,
            example_list: JSON.stringify(component.exampleList),
            status: constants.STATUS.ON,
            create_dt: timestamp,
            create_by: git.login,
            update_dt: timestamp,
            update_by: git.login,
        }
        const versionService = new VersionService(app);
        const haveVersionDB = await versionService.queryOne({
            component_id: componentId,
            version: versonData.version
        })
        if (!haveVersionDB) {

            const versionRes = versionService.insert(versonData);
            if (!versionRes) {
                ctx.body = failed('添加组件失败');
                return;
            }
        } else {
            const updateData = {
                build_path: component.buildPath,
                example_path: component.examplePath,
                example_list: JSON.stringify(component.exampleList),
                update_dt: timestamp,
                update_by: git.login,
            }
            const versionRes = await versionService.update(updateData, {
                component_id: componentId,
                version: versonData.version
            })
            if (!versionRes) {
                ctx.body = failed('更新组件失败');
                return;
            }
        }
        //向OSS中上传组件预览文件
        const task = new ComponentTask({
            repo: git.remote,
            version: git.version,
            name: component.className,
            branch: git.branch,
            buildPath: component.buildPath,
            examplePath: component.examplePath,
        }, { ctx });
        ctx.body = success('添加组件成功', {
            component: await componentService.queryOne({ id: componentId }),
            version: await versionService.queryOne({ version: versionData.version, component_id: componentId })
        });

    }
}

module.exports = ComponentsController;


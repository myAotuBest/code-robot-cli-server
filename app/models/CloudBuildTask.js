/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-07-10 23:06:51
 * @LastEditors: Roy
 * @LastEditTime: 2021-07-22 12:00:16
 * @Deprecated: 否
 * @FilePath: /roy-cli-server/app/models/CloudBuildTask.js
 */
'use strict';
const userHome = require('user-home');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const Git = require('simple-git');
const glob = require('glob');

const { SUCCESS, FAILED } = require('../const');
const config = require('../../config/db');
const OSS = require('../models/OSS');
const REDIST_PREFIX = 'cloudbuild';

class CloudBuildTask {
    constructor(options, ctx, app) {
        this._ctx = ctx;
        this._app = app;
        this._logger = this._ctx.logger;
        this._repo = options.repo; // 仓库地址
        this._name = options.name; // 项目名称
        this._version = options.version; // 项目版本号
        this._branch = options.branch; // 仓库分支号
        this._buildCmd = options.buildCmd; // 构建命令
        this._dir = path.resolve(userHome, '.code-robot-cli', 'cloudbuild', `${this._name}@${this._version}`); // 缓存目录
        this._sourceCodeDir = path.resolve(this._dir, this._name); // 缓存源码目录
        this._prod = options.prod === 'true';
        this._logger.info('_dir', this._dir);
        this._logger.info('_sourceCodeDir', this._sourceCodeDir);
        this._logger.info('_prod', this._prod);
    }

    async prepare() {
        fse.ensureDirSync(this._dir);
        fse.emptyDirSync(this._dir);
        this._git = new Git(this._dir);
        if (this._prod) {
            this.oss = new OSS(config.OSS_PROD_BUCKET);
        } else {
            this.oss = new OSS(config.OSS_DEV_BUCKET);
        }
        return this.success();
    }

    async download() {
        await this._git.clone(this._repo);
        this._git = new Git(this._sourceCodeDir);
        // git checkout -b dev/1.1.1 origin/dev/1.1.1
        await this._git.checkout([
            '-b',
            this._branch,
            `origin/${this._branch}`,
        ]);
        return fs.existsSync(this._sourceCodeDir) ? this.success() : this.failed();
    }

    async install() {
        const res = await this.execCommand('npm install --registry=https://registry.npm.taobao.org');
        return res ? this.success() : this.failed();
    }

    async build() {
        let res;
        if (checkCommand(this._buildCmd)) {
            res = await this.execCommand(this._buildCmd);
        } else {
            res = false;
        }
        return res ? this.success() : this.failed();
    }

    prePublish() {
        // 获取构建结果
        const buildPath = this.findBuildPath();
        // 检查构建结果
        if (!buildPath) {
            return this.failed('未找到构建结果，请检查');
        }
        this._buildPath = buildPath;
        return this.success();
    }

    findBuildPath() {
        const buildDir = ['dist', 'build'];
        const buildPath = buildDir.find(dir => fs.existsSync(path.resolve(this._sourceCodeDir, dir)));
        this._ctx.logger.info('buildPath', buildPath);
        if (buildPath) {
            return path.resolve(this._sourceCodeDir, buildPath);
        }
        return null;
    }

    publish() {
        return new Promise(resolve => {
            glob('**', {
                cwd: this._buildPath,
                nodir: true,
                ignore: '**/node_modules/**',
            }, (err, files) => {
                if (err) {
                    resolve(false);
                } else {
                    Promise.all(files.map(async file => {
                        const filePath = path.resolve(this._buildPath, file);
                        const uploadOSSRes = await this.oss.put(`${this._name}/${file}`, filePath);
                        return uploadOSSRes;
                    })).then(() => {
                        resolve(true);
                    }).catch(err => {
                        this._ctx.logger.error(err);
                        resolve(false);
                    });
                }
            });
        });
    }

    execCommand(command) {
        // npm install -> ['npm', 'install']
        const commands = command.split(' ');
        if (commands.length === 0) {
            return null;
        }
        const firstCommand = commands[0];
        const leftCommand = commands.slice(1) || [];
        return new Promise(resolve => {
            const p = exec(firstCommand, leftCommand, {
                cwd: this._sourceCodeDir,
            }, { stdio: 'pipe' });
            p.on('error', e => {
                this._ctx.logger.error('build error', e);
                resolve(false);
            });
            p.on('exit', c => {
                this._ctx.logger.info('build exit', c);
                resolve(true);
            });
            p.stdout.on('data', data => {
                this._ctx.socket.emit('building', data.toString());
            });
            p.stderr.on('data', data => {
                this._ctx.socket.emit('building', data.toString());
            });
        });
    }

    success(message, data) {
        return this.response(SUCCESS, message, data);
    }

    failed(message, data) {
        return this.response(FAILED, message, data);
    }

    response(code, message, data) {
        return {
            code,
            message,
            data,
        };
    }

    async clean() {
        if (fs.existsSync(this._dir)) {
            fse.removeSync(this._dir);
        }
        const { socket } = this._ctx;
        const client = socket.id;
        const redisKey = `${REDIST_PREFIX}:${client}`;
        await this._app.redis.del(redisKey);
    }

    isProd() {
        return this._prod;
    }
}

function checkCommand(command) {
    if (command) {
        const commands = command.split(' ');
        if (commands.length === 0 || ['npm', 'cnpm'].indexOf(commands[0]) < 0) {
            return false;
        }
        return true;
    }
    return false;
}

function exec(command, args, options) {
    const win32 = process.platform === 'win32';

    const cmd = win32 ? 'cmd' : command;
    const cmdArgs = win32 ? ['/c'].concat(command, args) : args;

    return require('child_process').spawn(cmd, cmdArgs, options || {});
}

async function createCloudBuildTask(ctx, app) {
    const { socket, helper } = ctx;
    const client = socket.id;
    const redisKey = `${REDIST_PREFIX}:${client}`;
    const redisTask = await app.redis.get(redisKey);
    const task = JSON.parse(redisTask);
    socket.emit('build', helper.parseMsg('create task', {
        message: '创建云构建任务',
    }));
    return new CloudBuildTask({
        repo: task.repo,
        name: task.name,
        version: task.version,
        branch: task.branch,
        buildCmd: task.buildCmd,
        prod: task.prod,
    }, ctx, app);
}


module.exports = {
    CloudBuildTask,
    createCloudBuildTask
};

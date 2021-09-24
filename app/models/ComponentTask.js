/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-08-22 14:26:43
 * @LastEditors: Roy
 * @LastEditTime: 2021-08-22 14:29:31
 * @Deprecated: 否
 * @FilePath: /roy-cli-server/app/models/ComponentTask.js
 */
'use strict';

const path = require('path');
const fs = require('fs');
const userHome = require('user-home');
const fse = require('fs-extra');
const Git = require('simple-git');
const OSS = require('./OSS');
const config = require('../../config/db');
const { formatName } = require('../utils');


class ComponentTask {
    constructor({ repo, version, name, branch, buildPath, examplePath }, { ctx }) {
        this._ctx = ctx;
        this._repo = repo;
        this._name = formatName(name);
        this._branch = branch;
        this._version = version;
        this._dir = path.resolve(userHome, '.code-robot-cli', 'node_modules', `${this._name}@${this._version}`);
        this._sourceCodeDir = path.resolve(this._dir, this._name);
        this._buildPath = path.resolve(this._sourceCodeDir, buildPath);
        this._examplePath = path.resolve(this._sourceCodeDir, examplePath);
        this._buildDir = buildPath;
        this._exampleDir = examplePath;
        fse.ensureDirSync(this._dir);
        fse.emptyDirSync(this._dir);
        this._git = new Git(this._dir);
        this.oss = new OSS(config.OSS_COMPONENT_BUCKET);
    }
}

module.exports = ComponentTask;
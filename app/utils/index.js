/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-08-22 12:31:07
 * @LastEditors: Roy
 * @LastEditTime: 2021-08-22 12:31:08
 * @Deprecated: 否
 * @FilePath: /roy-cli-server/app/utils/index.js
 */

module.exports = {
    formatName(name) {
        let _name = name;
        if (_name && _name.startsWith('@') && _name.indexOf('/') > 0) {
            // @imooc-cli-dev/component-test ->
            // imooc-cli-dev_component-test
            const nameArray = _name.split('/');
            _name = nameArray.join('_').replace('@', '');
        }
        return _name;
    },
};

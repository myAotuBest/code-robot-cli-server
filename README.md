# roy-cli-dev-server

config目录下的db.js里面配置根据自己的OSS，mysql，mongodb信息来配置，读取缓存文件目录的`oss_access_secret_key`和`mysql_password`是在`.roy-cli-dev`目录下，可以根据情况自己修改

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org
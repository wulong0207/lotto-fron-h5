/**
 * 开发环境按需编译脚本
 * yih879@13322.com
 * 2017.12.14
 */
const inquirer = require('inquirer');
const path = require('path');
const webpackDevConfig = require('../webpack/webpack.config.dev');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./config');
const helpers = require('./helpers');

init();

function init() {
  // 获取所有项目下的所有模块
  const choices = helpers.getAllProjects().reduce((acc, project) => {
    return acc.concat(new inquirer.Separator(project.title)).concat(
      project.apps
        .map(app => {
          return {
            name: `${app.name}${app.title ? ' ' + app.title : ''}`,
            value: app,
            disabled: app.default,
            checked: app.default
          };
        })
        .sort((a, b) => (a.disabled ? -1 : 1))
    );
  }, []);
  // 询问用户选择需要编译的模块
  inquirer
    .prompt({
      type: 'checkbox',
      name: 'apps',
      message: '请选择需要运行的应用:',
      choices: choices,
      pageSize: choices.length,
      default: choices
        .filter(choice => choice.value && choice.value.default)
        .map(app => app.value)
    })
    .then(answer => {
      const defaultApps = choices
        .filter(choice => choice.value && choice.value.default)
        .map(app => app.value);
      const selectedApps = answer.apps.concat(defaultApps);
      if (!selectedApps.length) return process.exit(1);
      startWebpackBuild(selectedApps);
    })
    .catch(e => console.log(e));
}

// 开始 webpack 构建
function startWebpackBuild(apps) {
  const compiler = helpers.setupCompiler(webpackDevConfig, apps);
  startWebpackDevServer(compiler);
}

// 开启 webpack dev server
function startWebpackDevServer(compiler) {
  // let firstTimeCompile = true;
  // compiler.plugin('done', stats => {
  //   stats = stats.toJson();
  //   if (stats.errors && stats.errors.length > 0) {
  //     // show errors
  //     return undefined;
  //   }
  //   // 如果是初次编译完成, 打开浏览器
  //   if (firstTimeCompile) {
  //     opn('http://localhost:' + config.port, {
  //       app: ['google chrome']
  //     });
  //     firstTimeCompile = false;
  //   }
  // });
  const server = new WebpackDevServer(compiler, {
    contentBase: path.join(config.ROOT_DIR, 'build'),
    historyApiFallback: true,
    inline: true,
    stats: { colors: true },
    disableHostCheck: true, // 取消 header 检查
    proxy: {
      '/lotto/**': {
        target: 'https://devm.2ncai.com',
        changeOrigin: true
      },
      '/lotto-point/**': {
        target: ' http://192.168.74.166:8202',
        changeOrigin: true
      }
    }
  });
  server.listen(config.port, config.host, function() {
    console.log('server started at ' + config.port);
  });
}

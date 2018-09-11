const path = require('path');
const config = require('./config');
const fs = require('fs');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const chalk = require('chalk');
const log = console.log;

const isProduction = env => env === config.ENV_PRODUCTION;
const isDevelopment = env => env === config.ENV_DEVELOPMENT;
const isSit = env => env === config.ENV_SIT;
const isUat = env => env === config.ENV_UAT;
const isPreview = env => env === config.ENV_PREVIEW;

/**
 * 获取应用配置 (app.config.js)
 * @param {object} app {name: string, dir: string}
 */
function getAppConfig(app) {
  const appPath = path.join(app.dir);
  if (!isDirectory(appPath)) {
    log(chalk.white.bgHex('#E74C3C').bold(`错误：应用目录 ${app.dir} 不存在`));
    process.exit(1);
  }
  try {
    const appConfig = require(path.join(appPath, 'app.config.js'));
    if (Array.isArray(appConfig)) {
      return appConfig.map(conf => Object.assign({}, app, conf));
    }
    return [Object.assign({}, appConfig, app)];
  } catch (e) {
    log(
      chalk
        .hex('#111111')
        .bgHex('#F39C12')
        .bold(
          `警告：应用 ${app.dir} 缺少 ${chalk.hex('#FFF')(
            'app.config.js'
          )} 配置文件`
        )
    );
    return app;
  }
}

/**
 * 判断路径是否为文件夹
 * @param {string} source  路径
 */
function isDirectory(source) {
  try {
    return fs.lstatSync(source).isDirectory();
  } catch (e) {
    return false;
  }
}

/**
 * 获取所有的项目
 */
function getAllProjects() {
  return fs
    .readdirSync(config.PROJECTS_DIR)
    .filter(name => isDirectory(path.join(config.PROJECTS_DIR, name)))
    .map(getProject);
}

function getProject(project) {
  const dir = path.join(config.PROJECTS_DIR, project);
  const projectConfig = getProjectConfig({ name: project, dir: dir });
  return Object.assign(
    {},
    {
      name: project,
      apps: getAllApps({
        name: project,
        dir: path.join(config.PROJECTS_DIR, project)
      })
    },
    projectConfig
  );
}

/**
 * 获取项目配置文件
 * @param {*} project 项目名称
 */
function getProjectConfig(project) {
  const projectConfig = require(path.join(project.dir, 'project.config.js'));
  return Object.assign({}, project, projectConfig);
}

/**
 * 获取 apps 下所有的应用
 * @param  { object } project {name: string, dir: string}
 */
function getAllApps(project) {
  const appsDir = path.join(project.dir, 'apps');
  return fs
    .readdirSync(appsDir)
    .filter(name => isDirectory(path.join(appsDir, name)))
    .reduce((apps, app) => {
      const dir = path.join(appsDir, app);
      const appConfig = getAppConfig({ dir: dir, app: app });
      return apps.concat(
        appConfig.map(conf => Object.assign({}, { name: app, dir: dir }, conf))
      );
    }, []);
}

function generateProjectWebpackConfig(baseConfig, apps, env) {
  return merge(baseConfig, {
    entry: apps.reduce((acc, app) => {
      let entry = {};
      const appEntryFile = app.entry
        ? path.join(app.dir, app.entry)
        : path.join(app.dir, 'index.js');
      if (!fs.existsSync(appEntryFile)) {
        log(
          chalk.white
            .bgHex('#E74C3C')
            .bold(`错误：应用目录 ${app.dir} 没有入口文件 ${appEntryFile}`)
        );
        process.exit(1);
      }
      entry[app.name] = path.join(appEntryFile);

      return Object.assign({}, acc, entry);
    }, {}),
    plugins: apps.reduce(
      (acc, appConf) => acc.concat(parseAppConfig(appConf, env)),
      []
    )
  });
}

/**
 * 设置编译器
 * @param {object} baseConfig webpack 编译配置
 * @param {*} apps 编译模块
 */
function setupCompiler(baseConfig, apps, env) {
  const webpackConfig = generateProjectWebpackConfig(baseConfig, apps);
  const compiler = webpack(webpackConfig);
  return compiler;
}

/**
 * 解析应用配置
 * @param {object} appConf 应用配置
 */
function parseAppConfig(appConf, env) {
  const appConfig = Array.isArray(appConf) ? appConf : [appConf];
  return appConfig.map(conf => {
    const chunks = ['common', conf.name];
    return new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          chunksSortMode: 'dependency',
          title: conf.title || '2N彩票',
          filename: conf.filename || conf.name + '/index.html',
          template:
            conf.template || path.join(config.ROOT_DIR, 'template/common.html'),
          inject: true,
          chunks: chunks
        },
        conf
      )
    );
  });
}

module.exports = {
  getAppConfig: getAppConfig,
  isDirectory: isDirectory,
  getAllApps: getAllApps,
  setupCompiler: setupCompiler,
  getAllProjects: getAllProjects,
  generateProjectWebpackConfig: generateProjectWebpackConfig,
  getProject: getProject,
  isProduction: isProduction,
  isDevelopment: isDevelopment,
  isSit: isSit,
  isUat: isUat,
  isPreview: isPreview
};

const helpers = require('./helpers');
const productBaseWebpackConfig = require('../webpack/webpack.config.prod');
const sitBaseWebpackConfig = require('../webpack/webpack.config.sit');
const uatBaseWebpackConfig = require('../webpack/webpack.config.uat');
const previewBaseWebpackConfig = require('../webpack/webpack.config.preview');
// const parallelWebpack = require('parallel-webpack');
const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

build();

function build() {
  let baseConfig = productBaseWebpackConfig;
  const runtimeEnv = process.env.RUNTIME_ENV;
  if (helpers.isSit(runtimeEnv)) {
    baseConfig = sitBaseWebpackConfig;
  } else if (helpers.isUat(runtimeEnv)) {
    baseConfig = uatBaseWebpackConfig;
  } else if (helpers.isPreview(runtimeEnv)) {
    baseConfig = previewBaseWebpackConfig;
  }
  const projects = helpers.getAllProjects();
  Promise.all(
    projects.map(project => projectBuild(project, baseConfig, runtimeEnv))
  ).then(() => {
    console.log('编译完成');
  });
}

function projectBuild(project, baseConfig, env) {
  const compiler = helpers.setupCompiler(
    merge(baseConfig, {
      plugins: [
        new webpack.optimize.CommonsChunkPlugin({
          name: 'common',
          filename: `js/${project.name}/common${
            helpers.isProduction(env) ? '.[hash:8]' : ''
          }.js`
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'manifest',
          filename: `js/${project.name}/manifest${
            helpers.isProduction(env) ? '.[hash:8]' : ''
          }.js`
        }),
        new InlineManifestWebpackPlugin({
          name: 'webpackManifest'
        })
      ],
      output: {
        // path: path.resolve(__dirname, './build/'),
        path: path.join(__dirname, '../build/'),
        filename: `js/${project.name}/[name]${
          helpers.isProduction(env) ? '.[chunkhash:8]' : ''
        }.js`,
        chunkFilename: `js/${project.name}/[id]${
          helpers.isProduction(env) ? '.[chunkhash:8]' : ''
        }.js`,
        publicPath: '/' // 静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径
      }
    }),
    project.apps,
    env
  );
  return new Promise((resolve, reject) => {
    compiler.run(function(err, stats) {
      if (err) return reject(err);
      console.log(`${project.title}编译完成`);
      resolve(stats);
    });
  });
}

// function analyzer(project) {
//   return new BundleAnalyzerPlugin({
//     // Can be `server`, `static` or `disabled`.
//     // In `server` mode analyzer will start HTTP server to show bundle report.
//     // In `static` mode single HTML file with bundle report will be generated.
//     // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
//     analyzerMode: 'static',
//     // Path to bundle report file that will be generated in `static` mode.
//     // Relative to bundles output directory.
//     reportFilename: `report-${project.name}.html`,
//     // Module sizes to show in report by default.
//     // Should be one of `stat`, `parsed` or `gzip`.
//     // See "Definitions" section for more information.
//     defaultSizes: 'parsed',
//     // Automatically open report in default browser
//     openAnalyzer: true,
//     // If `true`, Webpack Stats JSON file will be generated in bundles output directory
//     generateStatsFile: false,
//     // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
//     // Relative to bundles output directory.
//     statsFilename: 'stats.json',
//     // Options for `stats.toJson()` method.
//     // For example you can exclude sources of your modules from stats file with `source: false` option.
//     // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
//     statsOptions: null,
//     // Log level. Can be 'info', 'warn', 'error' or 'silent'.
//     logLevel: 'info'
//   });
// }

// function parallelBuild() {
//   let baseConfig = productBaseWebpackConfig;
//   const runtimeEnv = process.env.RUNTIME_ENV;
//   if (runtimeEnv === 'sit') {
//     baseConfig = sitBaseWebpackConfig;
//   } else if (runtimeEnv === 'uat') {
//     baseConfig = uatBaseWebpackConfig;
//   } else if (runtimeEnv === 'preview') {
//     baseConfig = previewBaseWebpackConfig;
//   }
//   const projects = helpers.getAllProjects();
//   const configs = projects.map(project =>
//     getProjectConfig(baseConfig, project)
//   );
//   parallelWebpack.run(configs, {
//     watch: false,
//     maxRetries: 1,
//     stats: true, // defaults to false
//     maxConcurrentWorkers: projects.l // use 2 workers
//   });
//   compiler.run(function(err, stats) {
//     if (err) {
//       console.log(err);
//       process.exit(1);
//     }
//     console.log(`编译完成`);
//   });
// }

// function getProjectConfig(baseConfig, project) {
//   return helpers.generateProjectWebpackConfig(baseConfig, project.apps);
// }

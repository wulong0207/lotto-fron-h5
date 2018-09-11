var gulp = require('gulp');
const del = require('del');
var gulpEnv = require('gulp-env');
const runSequence = require('run-sequence');
const gulpLoadPlugins = require('gulp-load-plugins');

// load all gulp plugins
const plugins = gulpLoadPlugins();
const env = process.env.NODE_ENV || 'development';
const isProduction = () => env === 'production';
const date = new Date().getTime();

// Lint source code
gulp.task('lint', () => {
	return gulp.src(['*.{js,json}', '**/*.{js,json}', '!node_modules/**',
		 '!**/lib/**', '!build/**', '!**/bluebird.js', "!gulpfile.js"])
		// .pipe(plugins.eslint({configFle:"./.eslintrc"})) //使用你的eslint校验文件
		// .pipe(plugins.eslint.format())
		//.pipe(plugins.eslint())
		//.pipe(plugins.eslint.format('node_modules/eslint-friendly-formatter'))
		//.pipe(plugins.eslint.failAfterError())
});


gulp.task('compile:js', () => {
	const envs = gulpEnv.set({
		NODE_ENV: env
	});
	return gulp.src(['src/**/*.js', '!src/lib/*.js'])
		.pipe(envs)
		//.pipe(plugins.sourcemaps.init())
		.pipe(plugins.babel({
			"presets": ['es2015']
		}))
		//.pipe(plugins.if(isProduction, plugins.babel()))
		.pipe(plugins.if(isProduction, plugins.uglify())).on('error', function (e) {
			console.log(e);
		})
		//.pipe(plugins.sourcemaps.write('.'))
		.pipe(plugins.replace(/{_VERSION_}/gi, date))
		.pipe(gulp.dest('../build'));
});

gulp.task('extras:lib', () => {
	return gulp.src(['src/**/lib/*.js'])
		.pipe(plugins.if(isProduction, plugins.uglify())).on('error', function (e) {
			console.log(e);
		})
		.pipe(gulp.dest('../build'));
});

// Compile html source to distribution directory
gulp.task('compile:html', () => {
	return gulp.src(['src/**/*.html'])
		//.pipe(plugins.sourcemaps.init())
		.pipe(plugins.if(isProduction, plugins.htmlmin({
			collapseWhitespace: true,
			// collapseBooleanAttributes: true,
			// removeAttributeQuotes: true,
			keepClosingSlash: true, // html
			removeComments: true,
			removeEmptyAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true
		})))
		//.pipe(plugins.sourcemaps.write('.'))
		.pipe(plugins.replace(/{_VERSION_}/gi, date))
		.pipe(gulp.dest('../build'));
});

// Compile css source to distribution directory
gulp.task('compile:css', () => {
  return gulp.src(['src/**/*.css'])
		//.pipe(plugins.sourcemaps.init())
		.pipe(plugins.if(isProduction, plugins.cssnano({
			compatibility: '*'
		})))
		//.pipe(plugins.sourcemaps.write('.'))
		.pipe(plugins.replace(/{_VERSION_}/gi, date))
		.pipe(gulp.dest('../build'));
});

// Compile json source to distribution directory
gulp.task('compile:json', () => {
	return gulp.src(['src/**/*.json'])
		//.pipe(plugins.sourcemaps.init())
		.pipe(plugins.jsonminify())
		//.pipe(plugins.sourcemaps.write('.'))
		.pipe(plugins.replace(/{_VERSION_}/gi, date))
		.pipe(gulp.dest('../build'))
});

// Compile img source to distribution directory
gulp.task('compile:img', () => {
	return gulp.src(['src/**/*.{jpg,jpeg,png,gif}'])
		.pipe(plugins.imagemin())
		.pipe(gulp.dest('../build'));
});


// Compile source to distribution directory
gulp.task('compile', /*['clean'],*/ next => {
	runSequence([
		'compile:js',
		'extras:lib',
		'compile:html',
		'compile:css',
		'compile:json',
		'compile:img'
	], next)
});

// Copy extras to distribution directory
gulp.task('extras', [], () => {
	return gulp.src([
			'src/**/*.*',
			'!src/**/*.js',
			'!src/**/*.html',
			'!src/**/*.css',
			'!src/**/*.json',
			'!src/**/*.{jpe?g,png,gif}'
		])
		.pipe(gulp.dest('../build'))
});


/**
 * Watch source change
 */
gulp.task('watch', ['build'], () => {
	gulp.watch('src/**/*.js', ['compile:js', 'extras:lib'])
	gulp.watch('src/**/*.html', ['compile:html'])
	gulp.watch('src/**/*.css', ['compile:css'])
	gulp.watch('src/**/*.json', ['compile:json'])
	gulp.watch('src/**/*.{jpe?g,png,gif}', ['compile:img'])
});


// Default task
gulp.task('default', ['watch']);


// Build
gulp.task('build', ['lint'], next => runSequence(['compile', 'extras'], next));

// Clean distribution directory
gulp.task('clean', del.bind(null, ['../build/*']));
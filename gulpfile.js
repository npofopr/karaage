'use strict';

const gulp = require('gulp');

const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const jade = require('gulp-jade');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const newer = require('gulp-newer');
const debug = require('gulp-debug');
const remember = require('gulp-remember');
const cached = require('gulp-cached');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const path = require('path');
const browserSync = require('browser-sync').create();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

var basePaths = {
	src: 'src/',
	dest: 'public/',
	bower: 'bower_components/'
};
var paths = {
	build: {
		html: 'build',
		jade: 'build',
		jsindex: 'build',
		css: 'build/css/',
		postcss: 'build',
		stylus: 'build/css/',
		img: 'build/images/',
		fonts: 'build/fonts/',
		csspartials: 'build/css/libs/',
		jspartials: 'build/js/libs/',
		static: 'build'
	},
	public: {
		html: 'public',
		jade: 'public',
		jsindex: 'public',
		css: 'public',
		postcss: 'public',
		stylus: 'public',
		img: 'public/images/',
		fonts: 'public/',
		csspartials: 'public/css/libs/',
		jspartials: 'public',
		static: 'public'
	},
	src: {
		html: 'src/*.html',
		jade: [
			'src/*.jade',
			'!src/_*.jade'
		],
		jsindex: 'src/js/index.js',
		css: 'src/css/style.css',
		postcss: 'src/css/style.css',
		stylus: 'src/css/stylus.styl',
		img: 'src/images/**/*.*',
		fonts: 'src/fonts/**/*.*',
		csspartials: 'src/css/libs/**/*.*',
		jspartials: 'src/js/libs/**/*.*',
		static: 'src/static/**/*.*'
	},
	clean: 'public'
};


gulp.task('serve', function () {
	// browserSync.use(htmlInjector, {
	// 	files: "build/*.html"
	// });
	browserSync.init({
		server: 'public',
	});
});

browserSync.watch('public/**/*.*').on('change', browserSync.reload);

gulp.task('clean', function() {
	return del('public');
});

gulp.task('fonts', function() {
	return gulp.src(paths.src.fonts, {since: gulp.lastRun('fonts'), base: 'src'})
		.pipe(newer(paths.public.fonts))
		.pipe(debug({title: 'fonts'}))
		.pipe(gulp.dest(paths.public.fonts));
});

gulp.task('static', function() {
	return gulp.src(paths.src.static, {since: gulp.lastRun('static'), base: 'src/static'})
		.pipe(newer(paths.public.static))
		.pipe(debug({title: 'static'}))
		.pipe(gulp.dest(paths.public.static));
});

gulp.task('jade', function() {
	return gulp.src(paths.src.jade, {since: gulp.lastRun('jade'), base: 'src'})
		.pipe(newer(paths.public.jade))
		.pipe(plumber({
			errorHandler: notify.onError(err => ({
				title: 'Jade',
				message: err.message
			}))
		}))
		.pipe(jade({ pretty: true }))
		.pipe(gulp.dest(paths.public.jade));
});

gulp.task('stylus', function() {
	return gulp.src(paths.src.stylus, {since: gulp.lastRun('stylus'), base: 'src'})
		.pipe(plumber({
			errorHandler: notify.onError(err => ({
				title: 'Styles',
				message: err.message
			}))
		}))
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(stylus())
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(remember('stylus'))
		.pipe(gulp.dest(paths.public.stylus));
});

gulp.task('postcss', function() {
	var processors = [
		autoprefixer({
			browsers: ['> 1%', 'last 2 version', 'IE 9']
		})
	];
	return gulp.src(paths.src.postcss, {since: gulp.lastRun('postcss'), base: 'src'})
		.pipe(cached('style'))
		.pipe(plumber({
			errorHandler: notify.onError(err => ({
				title: 'Styles',
				message: err.message
			}))
		}))
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(postcss(processors))
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(remember('postcss'))
		.pipe(gulp.dest(paths.public.postcss));
});

gulp.task('jsindex', function () {
	return gulp.src(paths.src.jsindex, {since: gulp.lastRun('jsindex'), base: 'src'})
		//.pipe(newer(path.public.jsindex))
		// .pipe(sourcemaps.init())
		// .pipe(sourcemaps.write())
		// .pipe(gulp.dest(paths.public.js))
		// .pipe(uglify())
		// .pipe(rename("index.min.js"))
		.pipe(debug({title: 'JS index'}))
		.pipe(gulp.dest(paths.public.jsindex));
});

gulp.task('style', function() {
	return gulp.src(paths.src.csspartials, {since: gulp.lastRun('style'), base: 'src'})
		.pipe(cached('style'))
		// .pipe(gulpIf(isDevelopment, sourcemaps.init()))
		// .pipe(style())
		// .pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(remember('style'))
		.pipe(concat('all.css'))
		.pipe(gulp.dest(paths.public.csspartials));
});


gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('jade', 'stylus', 'postcss', 'jsindex', 'style', 'fonts', 'static'))
);

gulp.task('watch', function() {
	gulp.watch(paths.src.jade, gulp.series('jade')).on('unlink', function(filepath) {
		remember.forget('jade', path.resolve(filepath));
		delete cached.caches.jade[path.resolve(filepath)];
	});

	gulp.watch(paths.src.stylus, gulp.series('stylus')).on('unlink', function(filepath) {
		remember.forget('stylus', path.resolve(filepath));
		delete cached.caches.stylus[path.resolve(filepath)];
	});

	gulp.watch(paths.src.postcss, gulp.series('postcss')).on('unlink', function(filepath) {
		remember.forget('postcss', path.resolve(filepath));
		delete cached.caches.postcss[path.resolve(filepath)];
	});

	gulp.watch(paths.src.jsindex, gulp.series('jsindex')).on('unlink', function(filepath) {
		remember.forget('jsindex', path.resolve(filepath));
		delete cached.caches.jsindex[path.resolve(filepath)];
	});

	gulp.watch(paths.src.csspartials, gulp.series('style')).on('unlink', function(filepath) {
		remember.forget('style', path.resolve(filepath));
		delete cached.caches.style[path.resolve(filepath)];
	});

	gulp.watch(path.src.fonts, gulp.series('fonts')).on('unlink', function(filepath) {
		remember.forget('fonts', path.resolve(filepath));
		delete cached.caches.fonts[path.resolve(filepath)];
	});

	gulp.watch('path.src.static', gulp.series('static')).on('unlink', function(filepath) {
		remember.forget('static', path.resolve(filepath));
		delete cached.caches.static[path.resolve(filepath)];
	});
});

gulp.task('dev', gulp.series(
	'build',
	gulp.parallel('watch', 'serve')
));

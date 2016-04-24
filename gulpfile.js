'use strict';

const gulp = require('gulp');
const jade = require('gulp-jade');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const newer = require('gulp-newer');
const debug = require('gulp-debug');
const remember = require('gulp-remember');
const cached = require('gulp-cached');
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
		js: 'build/js/',
		css: 'build/css/',
		stylus: 'build/css/',
		img: 'build/images/',
		fonts: 'build/fonts/',
		csspartials: 'build/css/libs/',
		jspartials: 'build/js/libs/',
		staticf: 'build'
	},
	public: {
		html: 'public',
		jade: 'public',
		js: 'public/js/',
		css: 'public',
		stylus: 'public',
		img: 'public/images/',
		fonts: 'public',
		csspartials: 'public/css/libs/',
		jspartials: 'public/js/libs/',
		staticf: 'public'
	},
	src: {
		html: 'src/*.html',
		jade: [
			'src/*.jade',
			'!src/_*.jade'
		],
		js: 'src/js/index.js',
		css: 'src/css/style.css',
		stylus: 'src/css/style.styl',
		img: 'src/images/**/*.*',
		fonts: 'src/fonts/**/*.*',
		csspartials: 'src/css/libs/**/*.*',
		jspartials: 'src/js/libs/**/*.*',
		staticf: 'src/static/**/*.*'
	},
	watch: {
		html: 'src/**/*.html',
		jade: 'src/**/*.jade',
		js: 'src/js/**/*.js',
		css: 'src/css/**/*.css',
		stylus: 'src/css/style.styl',
		img: 'src/images/**/*.*',
		fonts: 'src/fonts/**/*.*',
		csspartials: 'src/css/libs/**/*.*',
		jspartials: 'src/js/libs/**/*.*',
		staticf: 'src/static/**/*.*'
	},
	clean: 'public'
};


gulp.task('serve', function () {
	// browserSync.use(htmlInjector, {
	// 	files: "build/*.html"
	// });
	browserSync.init({
		server: 'public'
		//tunnel: false,
		//host: 'localhost',
		//port: 9000,
		//logLevel: "silent",
		// logLevel: "info",
		//logPrefix: "npofopr",
		//notify: false,
		//ghostMode: false,
		//online: false,
		//open: true
	});
});

browserSync.watch('public/**/*.*').on('change', browserSync.reload);

gulp.task('clean', function() {
	return del('public');
});

gulp.task('fonts', function() {
	return gulp.src(paths.src.fonts, {since: gulp.lastRun('fonts'), base: './src'})
		.pipe(newer(paths.public.fonts))
		.pipe(debug({title: 'fonts'}))
		.pipe(gulp.dest(paths.public.fonts));
});

gulp.task('jade', function() {
	return gulp.src(paths.src.jade, {since: gulp.lastRun('jade'), base: './src'})
		.pipe(jade({ pretty: true }))
		.pipe(gulp.dest(paths.public.jade));
});

gulp.task('stylus', function() {
	return gulp.src(paths.src.stylus, {since: gulp.lastRun('stylus'), base: './src'})
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(stylus())
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(remember('stylus'))
		.pipe(gulp.dest(paths.public.stylus));
});

gulp.task('style', function() {
	return gulp.src('src/css/libs/**/*.css')
		.pipe(cached('style'))
		// .pipe(gulpIf(isDevelopment, sourcemaps.init()))
		// .pipe(style())
		// .pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(remember('style'))
		.pipe(concat('all.css'))
		.pipe(gulp.dest('public'));
});


gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('jade', 'stylus', 'style', 'fonts'))
);

gulp.task('watch', function() {
	gulp.watch(paths.src.jade, gulp.series('jade', function jadeFinish() {
		console.log('Компиляция файлов шаблона завершена');
	}));
	gulp.watch(paths.src.stylus, gulp.series('stylus')).on('unlink', function(filepath) {
		remember.forget('stylus', path.resolve(filepath));
	});
	gulp.watch('src/css/libs/**/*.css', gulp.series('style')).on('unlink', function(filepath) {
		remember.forget('style', path.resolve(filepath));
		delete cached.caches.style[path.resolve(filepath)];
	});
	gulp.watch('path.src.fonts', gulp.series('fonts'));
});

gulp.task('dev', gulp.series(
	'build',
	gulp.parallel('watch', 'serve')
));

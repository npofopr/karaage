'use strict';

const gulp = require('gulp');

const postcss = require('gulp-postcss');
const cssnano = require('gulp-cssnano');
const assets  = require('postcss-assets');
const cssnext = require('postcss-cssnext');
const precss = require('precss');
const postcssInlineSVG = require('postcss-inline-svg');
const postcssShort = require('postcss-short');
const postcssCenter = require('postcss-center');
const postcssPxtorem = require('postcss-pxtorem');
const postcssClearfix = require('postcss-clearfix');
const postcssFocus = require('postcss-focus');
const mqpacker = require('css-mqpacker');
const postcssEasings = require('postcss-easings');
const postcssAnimation = require('postcss-animation');
const postcssFontmagician = require('postcss-font-magician');
const postcssFixFlex = require('postcss-flexbugs-fixes');
const postcssSprites = require('postcss-sprites').default;
const postcssNeat = require('postcss-neat');
//const lost = require('lost');

const pug = require('gulp-pug');
const htmlhint = require('gulp-htmlhint');
const rigger = require('gulp-rigger');

const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const jpegtran = require('imagemin-jpegtran');
const gifsicle = require('imagemin-gifsicle');

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
const gutil = require('gulp-util');
const del = require('del');
const path = require('path');
const rev = require('gulp-rev');
const combiner2 = require('stream-combiner2');
const browserSync = require('browser-sync').create();
const htmlInjector = require('bs-html-injector');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

var basePaths = {
	src: 'src/',
	dest: 'public/',
	bower: 'bower_components/'
};
var paths = {
	build: {
		html: 'build',
		pug: 'build',
		jsindex: 'build',
		css: 'build/css/',
		postcss: 'build',
		stylus: 'build/css/',
		img: 'build',
		fonts: 'build/fonts/',
		csspartials: 'build/css/libs/',
		jspartials: 'build/js/libs/',
		static: 'build'
	},
	public: {
		html: 'public',
		pug: 'public',
		jsindex: 'public',
		css: 'public',
		postcss: 'public',
		stylus: 'public',
		img: 'public',
		fonts: 'public/',
		csspartials: 'public/css/libs/',
		jspartials: 'public/js/libs/',
		static: 'public'
	},
	src: {
		html: 'src/*.html',
		pug: [
			'src/*.pug',
			'!src/_*.pug'
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

var configPrettify = {
	"indent_size": 4,
	"indent_char": " ",
	"eol": "\n",
	"indent_level": 0,
	"indent_with_tabs": true,
	"indent-inner-html": true,
	"preserve_newlines": true,
	"max_preserve_newlines": 10,
	"jslint_happy": false,
	"space_after_anon_function": false,
	"brace_style": "collapse",
	"keep_array_indentation": false,
	"keep_function_indentation": false,
	"space_before_conditional": true,
	"break_chained_methods": false,
	"eval_code": false,
	"unescape_strings": false,
	"wrap_line_length": 0,
	"wrap_attributes": "auto",
	"wrap_attributes_indent_size": 4,
	"end_with_newline": false
};

gulp.task('clean', function() {
	return del('public');
});

gulp.task('fonts', function() {
	return gulp.src(paths.src.fonts, {since: gulp.lastRun('fonts'), base: 'src'})
		.pipe(cached('fonts'))
		.pipe(plumber({
			errorHandler: notify.onError(err => ({
				title: 'Fonts',
				message: err.message
			}))
		}))
		.pipe(remember('fonts'))
		.pipe(gulp.dest(paths.public.fonts));
});

gulp.task('static', function() {
	return gulp.src(paths.src.static, {since: gulp.lastRun('static'), base: 'src/static'})
		.pipe(cached('static'))
		.pipe(plumber({
			errorHandler: notify.onError(err => ({
				title: 'Static',
				message: err.message
			}))
		}))
		.pipe(remember('static'))
		.pipe(gulp.dest(paths.public.static));
});

gulp.task('html', function() {
	return gulp.src(paths.src.html, {since: gulp.lastRun('html'), base: 'src'})
		.pipe(cached('html'))
		.pipe(plumber({
			errorHandler: notify.onError(err => ({
				title: 'Html',
				message: err.message
			}))
		}))
		.pipe(rigger())
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter())
		//.pipe(rev())
		.pipe(remember('html'))
		.pipe(gulp.dest(paths.public.html));
});

gulp.task('pug', function() {
	return gulp.src(paths.src.pug, {since: gulp.lastRun('pug'), base: 'src'})
		.pipe(cached('pug'))
		.pipe(plumber({
			errorHandler: notify.onError(err => ({
				title: 'pug',
				message: err.message
			}))
		}))
		.pipe(pug({ pretty: true }))
		.pipe(remember('pug'))
		.pipe(gulp.dest(paths.public.pug))
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter())
		.pipe(gulp.dest(paths.public.pug))

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
		postcssSprites({
			stylesheetPath: './public/css/',
			spritePath: './public/images/',
			basePath: './src/images/sprite/',
			//spritesmith.padding: '10',
			filterBy: function(image) {
			// Allow only png files
			if (!/\.png$/.test(image.url)) {
				return Promise.reject();
			}
				return Promise.resolve();
			}
			// filterBy: function(image) {
			//     // Allow only png files
			//     if (/^icon/.test(image.url.replace(/^.*[\\\/]/, ''))) {
			//         return Promise.reject();
			//     }
			//     return Promise.resolve();
			// }
		}),
		precss,
		assets({
			loadPaths: ['**']
		}),
		cssnext({
			browsers: ['> 1%', 'last 2 version', 'IE 9']
		}),
		postcssShort,
		postcssCenter,
		postcssClearfix,
		postcssFocus,
		postcssEasings,
		postcssAnimation,
		postcssFontmagician,
		postcssInlineSVG,
		postcssFixFlex,
		postcssPxtorem({
			//root_value: 16,
			//unit_precision: 5,
			//prop_white_list: ['font', 'font-size', 'line-height', 'letter-spacing'],
			//selector_black_list: [],
			replace: true,
			media_query: false
		}),
		postcssNeat({
			neatGridColumns: '12',
			//neatColumnWidth: '4.16em',
			neatGutterWidth: '1.338em', //20px
			neatMaxWidth: '85em',
			debugGridColor: '#ecf0f1'
		}),
		mqpacker
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
		.pipe(gulpIf(!isDevelopment, cssnano()))
		.pipe(gulp.dest(paths.public.postcss));
});

gulp.task('jsindex', function () {
	return gulp.src(paths.src.jsindex, {since: gulp.lastRun('jsindex'), base: 'src'})
		.pipe(cached('jsindex'))
		//.pipe(newer(path.public.jsindex))
		// .pipe(sourcemaps.init())
		// .pipe(sourcemaps.write())
		// .pipe(gulp.dest(paths.public.js))
		// .pipe(uglify())
		// .pipe(rename("index.min.js"))
		.pipe(plumber({
			errorHandler: notify.onError(err => ({
				title: 'JS index',
				message: err.message
			}))
		}))
		.pipe(remember('jsindex'))
		.pipe(gulp.dest(paths.public.jsindex));
});

gulp.task('image', function () {
	return gulp.src(paths.src.img, {since: gulp.lastRun('image'), base: 'src'})
		.pipe(cached('image'))
		.pipe(plumber({
			errorHandler: notify.onError(err => ({
				title: 'Images',
				message: err.message
			}))
		}))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant(), jpegtran(), gifsicle()],
			interlaced: true
		}))
		.pipe(remember('csscopy'))
		.pipe(gulp.dest(paths.public.img));
		//.pipe(reload({stream: true}))
		//.pipe(size());
		//.pipe(notifier('Images Minify'));
});

gulp.task('csscopy', function() {
	return gulp.src(paths.src.csspartials, {since: gulp.lastRun('csscopy'), base: 'src'})
		.pipe(cached('csscopy'))
		// .pipe(gulpIf(isDevelopment, sourcemaps.init()))
		// .pipe(style())
		// .pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(plumber({
			errorHandler: notify.onError(err => ({
				title: 'Style copy',
				message: err.message
			}))
		}))
		.pipe(remember('csscopy'))
		.pipe(concat('all.css'))
		.pipe(gulp.dest(paths.public.csspartials));
});

gulp.task('jscopy', function() {
	return gulp.src(paths.src.jspartials, {since: gulp.lastRun('jscopy'), base: 'src'})
		.pipe(cached('jscopy'))
		.pipe(plumber({
			errorHandler: notify.onError(err => ({
				title: 'JS copy',
				message: err.message
			}))
		}))
		// .pipe(gulpIf(isDevelopment, sourcemaps.init()))
		// .pipe(style())
		// .pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(remember('jscopy'))
		.pipe(concat('all.js'))
		.pipe(gulp.dest(paths.public.jspartials));
});


gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('html', 'pug', 'stylus', 'postcss', 'jsindex', 'image', 'csscopy', 'jscopy', 'fonts', 'static'))
);

gulp.task('watch', function() {
	gulp.watch(paths.src.html, gulp.series('html')).on('unlink', function(filepath) {
		remember.forget('html', path.resolve(filepath));
		delete cached.caches.html[path.resolve(filepath)];
	});

	gulp.watch(paths.src.pug, gulp.series('pug')).on('unlink', function(filepath) {
		remember.forget('pug', path.resolve(filepath));
		delete cached.caches.pug[path.resolve(filepath)];
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

	gulp.watch(paths.src.img, gulp.series('image')).on('unlink', function(filepath) {
		remember.forget('image', path.resolve(filepath));
		delete cached.caches.image[path.resolve(filepath)];
	});

	gulp.watch(paths.src.csspartials, gulp.series('csscopy')).on('unlink', function(filepath) {
		remember.forget('csscopy', path.resolve(filepath));
		delete cached.caches.csscopy[path.resolve(filepath)];
	});

	gulp.watch(paths.src.jspartials, gulp.series('jscopy')).on('unlink', function(filepath) {
		remember.forget('jscopy', path.resolve(filepath));
		delete cached.caches.jscopy[path.resolve(filepath)];
	});

	gulp.watch('path.src.fonts', gulp.series('fonts')).on('unlink', function(filepath) {
		remember.forget('fonts', path.resolve(filepath));
		delete cached.caches.fonts[path.resolve(filepath)];
	});

	gulp.watch('path.src.static', gulp.series('static')).on('unlink', function(filepath) {
		remember.forget('static', path.resolve(filepath));
		delete cached.caches.static[path.resolve(filepath)];
	});
});

gulp.task('serve', function () {
	browserSync.use(htmlInjector, {
		files: "public/*.html"
	});
	browserSync.init({
		server: 'public',
	});

	browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});


gulp.task('dev', gulp.series(
	'build',
	gulp.parallel('watch', 'serve')
));

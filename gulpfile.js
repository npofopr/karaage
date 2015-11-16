'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),

/*===============================
=            PostCSS            =
===============================*/
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	precss = require('precss'),
	center = require('postcss-center'),
	pxtorem = require('postcss-pxtorem'),
	clearfix = require('postcss-clearfix'),
	focus = require('postcss-focus'),
	nested = require('postcss-nested'),
	//mqpacker = require('css-mqpacker'),
	cssnext = require('cssnext'),
	minmax = require('postcss-media-minmax'),
	cssnano = require('cssnano'),
	postcssSVG = require('postcss-svg'),
	easings = require('postcss-easings'),
	fontmagician = require('postcss-font-magician'),
	postcssLookup = require('postcss-property-lookup'),
	postcssMedia = require('postcss-custom-media'),
	svgFallback = require('postcss-svg-fallback'),
	at2x = require('postcss-at2x'),
	postcssFixFlex = require('postcss-flexbugs-fixes'),
	//postcssUse = require('postcss-use'),
/*=====  End of PostCSS  ======*/

	sourcemaps = require('gulp-sourcemaps'),
	jade = require('gulp-jade'),
	htmlhint = require('gulp-htmlhint'),
//var uncss = require('gulp-uncss');
	uglify = require('gulp-uglify'),
	rigger = require('gulp-rigger'),
//var csso = require('gulp-csso');
	rev = require('gulp-rev-append'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	jpegtran = require('imagemin-jpegtran'),
	gifsicle = require('imagemin-gifsicle'),
	optipng = require('imagemin-optipng'),
	rename = require('gulp-rename'),
	rimraf = require('rimraf'),
	notifier = require('gulp-notify'),
	copy = require('gulp-copy'),
	size = require('gulp-filesize'),
	newer = require('gulp-newer'),
	gutil = require('gulp-util'),
	browserSync = require('browser-sync'),
	pkg = require('./package.json'),
	reload = browserSync.reload;

var path = {
	build: {
		html: 'build/',
		jade: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/images/',
		fonts: 'build/fonts/',
		csspartials: 'build/css/libs/',
		jspartials: 'build/js/libs/',
		staticf: 'build/'
	},
	src: {
		html: 'src/*.html',
		//jade: 'src/*.jade',
		jade: ['src/*.jade', '!src/_*.jade'],
		js: 'src/js/index.js',
		css: 'src/css/style.css',
		img: 'src/images/**/*.*',
		fonts: 'src/fonts/**/*.*',
		csspartials: 'src/css/libs/**/*.*',
		jspartials: 'src/js/libs/**/*.*',
		staticf: 'src/static/**/*.*'
	},
	watch: {
		html: 'src/**/*.html',
		jade: 'src/*.jade',
		js: 'src/js/**/*.js',
		css: 'src/css/**/*.css',
		img: 'src/images/**/*.*',
		fonts: 'src/fonts/**/*.*',
		csspartials: 'src/css/libs/**/*.*',
		jspartials: 'src/js/libs/**/*.*',
		staticf: 'src/static/**/*.*'
	},
	clean: './build'
};

var config = {
	server: {
		baseDir: "./build"
	},
	tunnel: false,
	host: 'localhost',
	port: 9000,
	logLevel: "silent",
	// logLevel: "info",
	//logPrefix: "npofopr",
	notify: false,
	ghostMode: false,
	online: false,
	open: true
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

gulp.task('webserver', function () {
	browserSync(config);
});

gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

/*gulp.task('hello', function () {
	gutil.beep();
	gutil.log(gutil.colors.black.bgYellow(" Welcome"));
	gutil.log(gutil.colors.black.bgYellow("             v." + pkg.version + " "));
});*/

gulp.task('html:build', function () {
	gulp.src(path.src.html)
		.pipe(newer(path.build.html))
		.pipe(rigger())
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter())
		.pipe(rev())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}))
		//.pipe(size())
		.pipe(notifier('Html Compiled'));
});

gulp.task('jade:build', function () {
	gulp.src(path.src.jade)
		.pipe(newer(path.build.jade))
		.pipe(jade({pretty: true}))
		//.pipe(gulpprettify(configPrettify))
		.pipe(gulp.dest(path.build.jade))
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter())
		.pipe(rev())
		.pipe(gulp.dest(path.build.jade))
		.pipe(reload({stream: true}))
		//.pipe(size())
		.pipe(notifier('Jade Compiled'));
});

gulp.task('js:build', function () {
	gulp.src(path.src.js)
		.pipe(newer(path.build.js))
		.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(uglify())
		.pipe(rename("index.min.js"))
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}))
		//.pipe(size())
		.pipe(notifier('JS Compiled'));
});

gulp.task('css:build', function () {
	var processors = [
		autoprefixer({
			browsers: ['last 2 version', 'IE 9']
		}),
		precss,
		at2x,
		center,
		pxtorem,
		clearfix,
		focus,
		nested,
		cssnext,
		minmax,
		cssnano({
			minifyFontWeight: false,
			calc: {precision: 2},
			convertValues: {length: false},
			discardComments: {removeAll: true},
			normalizeUrl: true
		}),
		easings,
		fontmagician,
		postcssSVG({
			paths: ['src/images/'],
		}),
		svgFallback({
			basePath: 'src/images/', // base path for the images found in the css
			dest: 'build/images/', // destination for the generated SVGs
			fallbackSelector: '.no-svg', // selector that gets prefixed to selector
			disableConvert: false, // when `true` only the css is changed (no new files created)
		}),
		postcssLookup,
		postcssMedia,
		postcssFixFlex,
	];
	gulp.src(path.src.css)
		.pipe(newer(path.build.css))
		.pipe(sourcemaps.init())
		.pipe(postcss(processors))
		//.pipe(uncss({
		//	html: ['build/**/*.html'],
		//	report: true
		//}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}))
		//.pipe(csso())
		//.pipe(rename("style.min.css"))
		//.pipe(gulp.dest(path.build.css))
		//.pipe(size())
		.pipe(notifier('Style Compiled, Prefixed and Minified'));
});

gulp.task('image:build', function () {
	gulp.src(path.src.img)
		.pipe(newer(path.build.img))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant(), jpegtran(), gifsicle()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}))
		.pipe(size())
		.pipe(notifier('Images Minify'));
});


//
// .. Copy
//
gulp.task('copyfonts', function() {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts));
});
gulp.task('copycss', function() {
	gulp.src(path.src.csspartials)
		.pipe(gulp.dest(path.build.csspartials));
});
gulp.task('copyjs', function() {
	gulp.src(path.src.jspartials)
		.pipe(gulp.dest(path.build.jspartials));
});
gulp.task('copystatic', function() {
	gulp.src(path.src.staticf)
		.pipe(gulp.dest(path.build.staticf));
});

gulp.task('build', [
	//'hello',
	'html:build',
	'jade:build',
	'js:build',
	'css:build',
	'image:build',
	'copyfonts',
	'copycss',
	'copyjs',
	'copystatic'
]);


gulp.task('watch', function(){
	gulp.watch([path.src.html], ["html:build"]);
	/*watch([path.watch.jade], function(event, cb) {
		gulp.start('jade:build');
	});*/
	gulp.watch([path.src.css], ["css:build"]);
	/*watch([path.watch.css], function(event, cb) {
		gulp.start('css:build');
	});*/
	gulp.watch([path.src.js], ["js:build"]);
	/*watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});*/
	gulp.watch([path.src.img], ["image:build"]);
	/*watch([path.watch.img], function(event, cb) {
		gulp.start('image:build');
	});*/
	gulp.watch([path.src.fonts], ["copyfonts"]);
	/*watch([path.watch.fonts], function(event, cb) {
		gulp.start('copyfonts');
	});*/
	gulp.watch([path.src.csspartials], ["copycss"]);
	/*watch([path.watch.csspartials], function(event, cb) {
		gulp.start('copycss');
	});*/
	gulp.watch([path.src.jspartials], ["copyjs"]);
	/*watch([path.watch.jspartials], function(event, cb) {
		gulp.start('copyjs');
	});*/
	gulp.watch([path.src.staticf], ["copystatic"]);
	/*watch([path.watch.staticf], function(event, cb) {
		gulp.start('copystatic');
	});*/
});


gulp.task('default', ['build', 'webserver', 'watch']);
//gulp.task('update', ['bump', 'npmUpdate']);

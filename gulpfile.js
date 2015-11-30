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
	mqpacker = require('css-mqpacker'),
	cssnext = require('cssnext'),
	minmax = require('postcss-media-minmax'),
	cssnano = require('cssnano'),
	postcssSVG = require('postcss-svg'),
	easings = require('postcss-easings'),
	fontmagician = require('postcss-font-magician'),
	//postcssLookup = require('postcss-property-lookup'), - precss
	postcssMedia = require('postcss-custom-media'),
	svgFallback = require('postcss-svg-fallback'),
	at2x = require('postcss-at2x'),
	postcssFixFlex = require('postcss-flexbugs-fixes'),
	fontVariant = require('postcss-font-variant'),
	//postcssUse = require('postcss-use'),
	lost = require('lost'),
	//neat = require('postcss-neat'),
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
		jade: 'src/**/*.jade',
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

gulp.task('hello', function () {
	gutil.beep();
	gutil.log(gutil.colors.black.bgYellow(" Welcome to                                                              "));
	gutil.log(gutil.colors.black.bgYellow("  ____  __.  _____ __________    _____      _____    ___________________ "));
	gutil.log(gutil.colors.black.bgYellow(" |    |/ _| /  _  \\______   \  /  _  \    /  _  \  /  _____/\_   _____/ "));
	gutil.log(gutil.colors.black.bgYellow(" |      <  /  /_\  \|       _/ /  /_\  \  /  /_\  \/   \  ___ |    __)_  "));
	gutil.log(gutil.colors.black.bgYellow(" |    |  \/    |    \    |   \/    |    \/    |    \    \_\  \|        \ "));
	gutil.log(gutil.colors.black.bgYellow(" |____|__ \____|__  /____|_  /\____|__  /\____|__  /\______  /_______  / "));
	gutil.log(gutil.colors.black.bgYellow("         \/       \/       \/         \/         \/        \/        \/  "));
	gutil.log(gutil.colors.black.bgYellow("                                                   v." + pkg.version + " "));
});

gulp.task('build:html', function () {
	gulp.src(path.src.html)
		.pipe(newer(path.build.html))
		.pipe(rigger())
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter())
		.pipe(rev())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
		//.pipe(size())
		//.pipe(notifier('Html Compiled'));
});

gulp.task('build:jade', function () {
	gulp.src(path.src.jade)
		.pipe(newer(path.build.jade))
		.pipe(jade({pretty: true}))
		//.pipe(gulpprettify(configPrettify))
		.pipe(gulp.dest(path.build.jade))
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter())
		.pipe(rev())
		.pipe(gulp.dest(path.build.jade))
		.pipe(reload({stream: true}));
		//.pipe(size())
		//.pipe(notifier('Jade Compiled'));
});

gulp.task('build:js', function () {
	gulp.src(path.src.js)
		.pipe(newer(path.build.js))
		.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(uglify())
		.pipe(rename("index.min.js"))
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
		//.pipe(size())
		//.pipe(notifier('JS Compiled'));
});

gulp.task('build:css', function () {
	var processors = [
		lost,
		//neat({
			//neatDefaultDisplay, sets the default display mode. Can be block, table or block-collapse. Default is block.
			//neatDefaultDirection, sets the default layout direction of the grid. Can be LTR or RTL. Default is LTR.
			//neatGridColumns, sets the total number of columns in the grid. Default is 12.
			//neatColumnWidth, sets the relative width of a single grid column. Default is 4.235801032000001em.
			//neatGutterWidth, sets the relative width of a single grid gutter. Default is 1.618em.
			//neatMaxWidth, sets the max-width property of the element that includes outer-container. Default is 64em.
			//debugGridColor, sets the background color for the debugging grid. Default is #ecf0f1.
			//debugGridLocation, sets the default location of the debugging grid. Default is after.
		//}),
		precss,
		at2x,
		center,
		clearfix,
		focus,
		minmax,
		//nested,
		easings,
		fontmagician,
		fontVariant,
		postcssMedia,
		postcssSVG({
			paths: ['build/images/svg'],
		}),
		svgFallback({
			basePath: 'src/css',
			dest: 'build/css',
			fallbackSelector: '.no-svg',
			disableConvert: false
		}),
		cssnext,
		cssnano({
			autoprefixer: false,
			calc: {precision: 2},
			convertValues: {length: false},
			discardComments: {removeAll: true},
			normalizeUrl: true
		}),
		postcssFixFlex,
		autoprefixer({
			browsers: ['> 1%', 'last 2 version', 'IE 9']
		}),
		pxtorem({
			//root_value: 16,
			//unit_precision: 5,
			//prop_white_list: ['font', 'font-size', 'line-height', 'letter-spacing'],
			//selector_black_list: [],
			replace: true,
			media_query: false
		}),
		mqpacker,
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
		.pipe(reload({stream: true}));
		//.pipe(csso())
		//.pipe(rename("style.min.css"))
		//.pipe(gulp.dest(path.build.css))
		//.pipe(size())
		//.pipe(notifier('Style Compiled, Prefixed and Minified'));
});

gulp.task('build:image', function () {
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
		.pipe(size());
		//.pipe(notifier('Images Minify'));
});


//
// .. Copy
//
gulp.task('copy:fonts', function() {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts));
});
gulp.task('copy:css', function() {
	gulp.src(path.src.csspartials)
		.pipe(gulp.dest(path.build.csspartials));
});
gulp.task('copy:js', function() {
	gulp.src(path.src.jspartials)
		.pipe(gulp.dest(path.build.jspartials));
});
gulp.task('copy:static', function() {
	gulp.src(path.src.staticf)
		.pipe(gulp.dest(path.build.staticf));
});

gulp.task('build', [
	'hello',
	'build:html',
	'build:jade',
	'build:js',
	'build:css',
	'build:image',
	'copy:fonts',
	'copy:css',
	'copy:js',
	'copy:static'
]);

gulp.task('watch', function(){
	gulp.watch([path.src.html], ["build:html"]);
	gulp.watch([path.src.css], ["build:css"]);
	gulp.watch([path.src.js], ["build:js"]);
	gulp.watch([path.src.img], ["build:image"]);
	gulp.watch([path.src.fonts], ["copy:fonts"]);
	gulp.watch([path.src.csspartials], ["copy:css"]);
	gulp.watch([path.src.jspartials], ["copy:js"]);
	gulp.watch([path.src.staticf], ["copy:static"]);
});

gulp.task('default', ['build', 'webserver', 'watch']);

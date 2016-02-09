'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),

/*===============================
=            PostCSS            =
===============================*/
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	precss = require('precss'),
	postcssCenter = require('postcss-center'),
	postcssPxtorem = require('postcss-pxtorem'),
	postcssClearfix = require('postcss-clearfix'),
	postcssFocus = require('postcss-focus'),
	mqpacker = require('css-mqpacker'),
	cssnext = require('postcss-cssnext'),
	postcssMinmax = require('postcss-media-minmax'),
	cssnano = require('cssnano'),
	//postcssSVG = require('postcss-svg'),
	postcssInlineSVG = require('postcss-inline-svg'),
	postcssEasings = require('postcss-easings'),
	postcssAnimation = require('postcss-animation'),
	postcssFontmagician = require('postcss-font-magician'),
	postcssMedia = require('postcss-custom-media'),
	postcssSvgFallback = require('postcss-svg-fallback'),
	postcssAt2x = require('postcss-at2x'),
	postcssFixFlex = require('postcss-flexbugs-fixes'),
	postcssFontVariant = require('postcss-font-variant'),
	postcssMixins = require('postcss-mixins'),
	//postcssUse = require('postcss-use'),
	//lost = require('lost'),
	postcssNeat = require('postcss-neat'),
	postcssColor = require('postcss-color-alpha'),
	postcssSprites = require('postcss-sprites').default,
	postcssStyleGuide = require('postcss-style-guide'),
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
	browserSync = require('browser-sync').create(),
	htmlInjector = require('bs-html-injector'),
	pkg = require('./package.json');
	//reload = browserSync.reload;

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

gulp.task('browser-sync', ['css', 'js', 'jade'], function () {
	browserSync.use(htmlInjector, {
	    files: "build/*.html"
	});
	browserSync.init({
		server: {
			baseDir: "./build"
		},
		//tunnel: false,
		host: 'localhost',
		port: 9000,
		//logLevel: "silent",
		// logLevel: "info",
		//logPrefix: "npofopr",
		notify: false,
		//ghostMode: false,
		//online: false,
		//open: true
    });
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

gulp.task('html', function () {
	return gulp.src(path.src.html)
		.pipe(newer(path.build.html))
		.pipe(rigger())
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter())
		.pipe(rev())
		.pipe(gulp.dest(path.build.html));
		//.pipe(reload({stream: true}));
		//.pipe(size())
		//.pipe(notifier('Html Compiled'));
});

gulp.task('jade', function () {
	return gulp.src(path.src.jade)
		.pipe(newer(path.build.jade))
		.pipe(jade({pretty: true}))
		//.pipe(gulpprettify(configPrettify))
		.pipe(gulp.dest(path.build.jade))
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter())
		.pipe(rev())
		.pipe(gulp.dest(path.build.jade));
		//.pipe(reload({stream: true}));
		//.pipe(size())
		//.pipe(notifier('Jade Compiled'));
});

gulp.task('js', function () {
	return gulp.src(path.src.js)
		.pipe(newer(path.build.js))
		.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(uglify())
		.pipe(rename("index.min.js"))
		.pipe(gulp.dest(path.build.js));
		//.pipe(reload({stream: true}));
		//.pipe(size())
		//.pipe(notifier('JS Compiled'));
});

gulp.task('css', function () {
	var processors = [
		postcssSprites({
			stylesheetPath: './build/css/',
			spritePath: './build/images/',
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
		autoprefixer({
			browsers: ['> 1%', 'last 2 version', 'IE 9']
		}),
		//lost,
		precss,
		cssnext,
		postcssAt2x,
		postcssCenter,
		postcssClearfix,
		postcssFocus,
		postcssMinmax,
		postcssEasings,
		postcssAnimation,
		postcssFontmagician,
		postcssFontVariant,
		postcssColor,
		postcssMedia,
		postcssInlineSVG,
		postcssSvgFallback({
			basePath: 'src/css',
			dest: 'build/css',
			fallbackSelector: '.no-svg',
			disableConvert: false
		}),
		/*cssnano({
			autoprefixer: false,
			calc: {precision: 2},
			convertValues: {length: false},
			discardComments: {removeAll: true},
			normalizeUrl: true
		}),*/
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
		mqpacker,
		postcssStyleGuide({
			//src: The path to the source CSS file.
			dest: "./build/styleguide/index.html",
			project: "Karaage",
			//showCode: The flag to show CSS code (default: true)
			//theme: Theme name. (default: psg-theme-default)
			//themePath: The path to theme file. (default: node_modules/psg-theme-default)
		}),
	];
	return gulp.src(path.src.css)
		.pipe(newer(path.build.css))
		.pipe(sourcemaps.init())
		.pipe(postcss(processors))
		//.pipe(uncss({
		//	html: ['build/**/*.html'],
		//	report: true
		//}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.css))
		.pipe(browserSync.stream()); //{match: '**/*.css'}
		//.pipe(reload({stream: true}));
		//.pipe(csso())
		//.pipe(rename("style.min.css"))
		//.pipe(gulp.dest(path.build.css))
		//.pipe(size())
		//.pipe(notifier('Style Compiled, Prefixed and Minified'));
});

gulp.task('image', function () {
	return gulp.src(path.src.img)
		.pipe(newer(path.build.img))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant(), jpegtran(), gifsicle()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		//.pipe(reload({stream: true}))
		.pipe(size());
		//.pipe(notifier('Images Minify'));
});


//
// .. Copy
//
gulp.task('copy:fonts', function() {
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts));
});
gulp.task('copy:css', function() {
	return gulp.src(path.src.csspartials)
		.pipe(gulp.dest(path.build.csspartials));
});
gulp.task('copy:js', function() {
	return gulp.src(path.src.jspartials)
		.pipe(gulp.dest(path.build.jspartials));
});
gulp.task('copy:static', function() {
	return gulp.src(path.src.staticf)
		.pipe(gulp.dest(path.build.staticf));
});

gulp.task('build', [
	'hello',
	'html',
	'jade',
	'js',
	'css',
	'image',
	'copy:fonts',
	'copy:css',
	'copy:js',
	'copy:static'
]);

gulp.task('watch', function(){
	gulp.watch([path.src.html], ["html"]); //, htmlInjector
	gulp.watch([path.src.jade], ["jade"]); //, htmlInjector
	gulp.watch([path.src.css], ["css"]);
	gulp.watch([path.src.js], ["js"]).on('change', browserSync.reload);
	gulp.watch([path.src.img], ["image"]); //.on('change', browserSync.reload)
	gulp.watch([path.src.fonts], ["copy:fonts"]).on('change', browserSync.reload);
	gulp.watch([path.src.csspartials], ["copy:css"]).on('change', browserSync.reload);
	gulp.watch([path.src.jspartials], ["copy:js"]).on('change', browserSync.reload);
	gulp.watch([path.src.staticf], ["copy:static"]).on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);

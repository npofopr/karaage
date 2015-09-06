'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
/*===============================
=            PostCSS            =
===============================*/
var postcss = require('gulp-postcss');
//var postcss = require('postcss');
var precss = require('precss');
var center = require('postcss-center');
var pxtorem = require('postcss-pxtorem');
var short = require('postcss-short');
var size = require('postcss-size');
var clearfix = require('postcss-clearfix');
var colorshort = require('postcss-color-short');
//var cssnano = require('cssnano');
//var cssnext = require('cssnext');
//var mixins = require('postcss-mixins');
//var svars = require('postcss-simple-vars');
var nested = require('postcss-nested');
//var discardcomments = require('postcss-discard-comments');
var focus = require('postcss-focus');
var autoprefixer = require('autoprefixer');
//var minmax = require('postcss-media-minmax');
//var at2x = require('postcss-at2x');
var duplicates = require('postcss-discard-duplicates');
var empty = require('postcss-discard-empty');
//var atImport = require('postcss-import');
//var mergeRules = require('postcss-merge-rules');
var fontWeight = require('postcss-minify-font-weight');
var mqpacker = require('css-mqpacker');
var svgFallback = require('postcss-svg-fallback');
/*=====  End of PostCSS  ======*/
var sourcemaps = require('gulp-sourcemaps');
var jade = require('gulp-jade');
var htmlhint = require('gulp-htmlhint');
//var uncss = require('gulp-uncss');
var uglify = require('gulp-uglify');
var rigger = require('gulp-rigger');
//var csso = require('gulp-csso');
var rev = require('gulp-rev-append');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var jpegtran = require('imagemin-jpegtran');
var gifsicle = require('imagemin-gifsicle');
var optipng = require('imagemin-optipng');
var rename = require('gulp-rename');
var rimraf = require('rimraf');
var notifier = require('gulp-notify');
var copy = require('gulp-copy');
var size = require('gulp-filesize');
var newer = require('gulp-newer');
var bump = require('gulp-bump');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

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
	tunnel: true,
	host: 'localhost',
	port: 9000
};

gulp.task('webserver', function () {
	browserSync(config);
});

gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

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
		//.pipe(changed('app', {extension: '.html'}))
		.pipe(jade({
			pretty: true
		}))
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
		precss,
		center,
		pxtorem,
		short,
		size,
		clearfix,
		colorshort,
		//cssnano,
		//cssnext,
		nested,
		focus,
		autoprefixer({ browsers: ['last 2 version', 'IE 9'] }),
		duplicates,
		empty,
		fontWeight,
		mqpacker,
		svgFallback({
			basePath: 'src/images/',
			dest: 'build/images/',
			fallbackSelector: '.no-svg'
		})
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
			use: [pngquant(), jpegtran(), optipng(), gifsicle()],
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


/*gulp.task('bump', function(){
  gulp.src('./package.json')
  .pipe(bump({type:'major', indent: 4 }))
  .pipe(gulp.dest('./'));
});

gulp.task('npmUpdate', function() {
  var update = require('gulp-update')();

  gulp.watch('./package.json').on('change', function (file) {
	update.write(file);
  });

})*/

gulp.task('build', [
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

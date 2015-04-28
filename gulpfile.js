'use strict';

var gulp = require('gulp'),
	fs = require('fs'),
	watch = require('gulp-watch'),
	//begin postcss
	postcss = require('gulp-postcss'),
	mixins = require('postcss-mixins'),
	svars = require('postcss-simple-vars'),
	nested = require('postcss-nested'),
	focus = require('postcss-focus'),
	autoprefixer = require('autoprefixer-core'),
	minmax = require('postcss-media-minmax'),
	at2x = require('postcss-at2x'),
	duplicates = require('postcss-discard-duplicates'),
	empty = require('postcss-discard-empty'),
	atImport = require('postcss-import'),
	mergeRules = require('postcss-merge-rules'),
	fontWeight = require('postcss-minify-font-weight'),
	mqpacker = require('css-mqpacker'),
	//end postcss
	sourcemaps = require('gulp-sourcemaps'),
	jade = require('gulp-jade'),
	htmlhint = require('gulp-htmlhint'),
	uncss = require('gulp-uncss'),
	uglify = require('gulp-uglify'),
	rigger = require('gulp-rigger'),
	csso = require('gulp-csso'),
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
	bump = require('gulp-bump'),
	gutil = require('gulp-util'),
	browserSync = require('browser-sync'),
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
		atImport({
			path: ["src/css"]
		}),
		mixins(),
		svars(),
		nested(),
		focus(),
		autoprefixer({ browsers: ['last 4 version', '> 1%', 'ie 8', 'ie 7'] }),
		at2x(),
		mergeRules(),
		fontWeight(),
		duplicates(),
		empty(),
		minmax(),
		mqpacker()
	];
	gulp.src(path.src.css)
		.pipe(newer(path.build.css))
		.pipe(sourcemaps.init())
		.pipe(postcss(processors))
		.pipe(uncss({
			html: ['build/**/*.html'],
			//ignore: ['label.active', '.dark-mode', 'span.tweet-time']
			report: true
			//uncssrc: '.uncssrc'
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}))
		.pipe(csso())
		.pipe(rename("style.min.css"))
		.pipe(gulp.dest(path.build.css))
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


gulp.task('bump', function(){
  gulp.src('./package.json')
  .pipe(bump({type:'major', indent: 4 }))
  .pipe(gulp.dest('./'));
});

gulp.task('npmUpdate', function() {
  var update = require('gulp-update')();

  gulp.watch('./package.json').on('change', function (file) {
	update.write(file);
  });

})

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
	watch([path.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	watch([path.watch.jade], function(event, cb) {
		gulp.start('jade:build');
	});
	watch([path.watch.css], function(event, cb) {
		gulp.start('css:build');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.watch.img], function(event, cb) {
		gulp.start('image:build');
	});
	watch([path.watch.fonts], function(event, cb) {
		gulp.start('copyfonts');
	});
	watch([path.watch.csspartials], function(event, cb) {
		gulp.start('copycss');
	});
	watch([path.watch.jspartials], function(event, cb) {
		gulp.start('copyjs');
	});
	watch([path.watch.staticf], function(event, cb) {
		gulp.start('copystatic');
	});
});


gulp.task('default', ['build', 'webserver', 'watch']);
gulp.task('update', ['bump', 'npmUpdate']);
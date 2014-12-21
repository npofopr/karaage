//****************************************************************************************************
//
// .. VARIABLES
//
//****************************************************************************************************
var gulp = require('gulp'), // Сообственно Gulp JS
    jade = require('gulp-jade'), // Плагин для Jade
    htmlhint = require('gulp-htmlhint'),
    prettify = require('gulp-html-prettify'),
    htmlreplace = require('gulp-html-replace'),
    stylus = require('gulp-stylus'),
    filter = require('gulp-filter'),
    //autoprefixer = require('gulp-autoprefixer'), // Расстановка префиксов
    autoprefixer = require('autoprefixer-core'),
	mqpacker = require('css-mqpacker'),
	csswring = require('csswring'),
    postcss = require('gulp-postcss'),
    csso = require('gulp-csso'), // Минификация CSS
    sourcemaps = require('gulp-sourcemaps'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'), // Минификация изображений
    svgo = require('imagemin-svgo'),
    optipng = require('imagemin-optipng'),
    gifsicle = require('imagemin-gifsicle'),
    webp = require('gulp-webp'),
    header  = require('gulp-header'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    ignore = require('gulp-ignore'),
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    browserSync = require('browser-sync'), // livereload
    reload = browserSync.reload,
    zip = require('gulp-zip'), // Архив собранного проекта
    plumber = require('gulp-plumber'),
    path = require('path'),
    package = require('./package.json');

//****************************************************************************************************
//
// .. TASKS
//
//****************************************************************************************************

var banner = [
	'/*!\n' +
	' * <%= package.name %>\n' +
	' * <%= package.title %>\n' +
	' * <%= package.url %>\n' +
	' * @author <%= package.author %>\n' +
	' * @version <%= package.version %>\n' +
	' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
	' */',
	'\n'
].join('');

var paths = {
    layouts: {
        src: ['assets/template/**/*.jade', '!assets/template/**/_*.jade'],  // Собираем Jade только в папке ./assets/template/* исключая файлы с _*
        dest: 'public'
    },
    layouts_build: {
        src: ['assets/template/*.jade', '!assets/template/_*.jade'],  // Собираем Jade только в папке ./assets/template/ исключая файлы с _*
        dest: 'build'
    },
    html: {
        src: ['assets/**/*.html'],
        dest: 'public'
    },
    html_build: {
        src: ['assets/**/*.html'],
        dest: 'build'
    },
    stylesheets: {
        src: ['assets/styles/**/*.styl', '!assets/styles/**/*_.styl'],
        dest: 'public'
    },
    stylesheets_build: {
        src: ['assets/styles/**/*.styl', '!assets/styles/**/*_.styl'],
        dest: 'build'
    },
    javascripts: {
        src: ['assets/js/**/*.js', '!assets/js/libs/**/*.js'],
        dest: 'public/js'
    },
    javascripts_build: {
        src: ['assets/js/**/*.js', '!assets/js/libs/**/*.js'],
        dest: 'build/js'
    },
    images: {
        src: 'assets/images/**/*',
        dest: 'public/images'
    },
    images_build: {
        src: 'assets/images/**/*',
        dest: 'build/images'
    },
    webp: {
        src: ['assets/images/template/**/*.jpg', 'assets/images/template/**/*.png'],
        dest: 'public/images/template'
    },
    webp_build: {
        src: ['assets/images/template/**/*.jpg', 'assets/images/template/**/*.png'],
        dest: 'build/images/template'
    },
    copycss: {
        src: 'assets/css/*.css',
        dest: 'public/css/libs'
    },
    copycss_build: {
        src: 'assets/css/**/*.css',
        dest: 'build/css/libs'
    },
    copyjs: {
        src: 'assets/js/**/*',
        dest: 'public/js'
    },
    copyjs_build: {
        src: 'assets/js/libs/*',
        dest: 'build/js/libs'
    },
    copyimg: {
        src: 'assets/img/**/*',
        dest: 'public/img'
    },
    copyimg_build: {
        src: 'assets/img/**/*',
        dest: 'build/img'
    },
    fonts: {
        src: 'assets/fonts/**/*',
        dest: 'public/fonts'
    },
    fonts_build: {
        src: 'assets/fonts/**/*',
        dest: 'build/fonts'
    },
    files: {
        src: 'assets/static/**/*',
        dest: 'public'
    },
    files_build: {
        src: 'assets/static/**/*',
        dest: 'build'
    },
    zip: {
        src: 'assets/*',
        dest: 'build'
    }
};

// Собираем Stylus
gulp.task('stylus', function() {
	var processors = [
		autoprefixer({browsers: ['last 4 version', '> 1%', 'ie 8', 'ie 7']}),
		mqpacker
		//csswring({preserveHacks: true})
	];
	return gulp.src(paths.stylesheets.src)
		.pipe(plumber())
		.pipe(stylus({
			sourcemap: {
				inline: true,
				sourceRoot: '.',
				basePath: 'css/build'
			}
		}))
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(postcss(processors))
		.pipe(header(banner, { package : package }))
		.pipe(sourcemaps.write('.', {
			includeConent: false,
			sourceRoot: '.'
		}))
		.pipe(gulp.dest(paths.stylesheets.dest))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('stylus:build', function() {
    var processors = [
		autoprefixer({browsers: ['last 4 version', '> 1%', 'ie 8', 'ie 7']}),
		mqpacker
		//csswring({preserveHacks: true})
	];
	return gulp.src(paths.stylesheets_build.src)
    .pipe(plumber())
    .pipe(stylus({set:['linenos']}))
    .pipe(postcss(processors))
    .pipe(gulp.dest(paths.stylesheets_build.dest))
    .pipe(rename("style.min.css"))
    .pipe(csso())
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest(paths.stylesheets_build.dest));
});


// css
//gulp.task('cssmin', function() {
//    gulp.src('assets/styles/mincss/*')
//    .pipe(csso())
//    .pipe(gulp.dest('public/css/min'));
//});

// html
gulp.task('html', function(){
    gulp.src(paths.html.src)
    	.pipe(plumber()) // Если есть ошибки, выводим и продолжаем
        .pipe(htmlhint({
            "tag-pair": true,
            "style-disabled": true,
            "img-alt-require": true,
            "tagname-lowercase": true,
            "src-not-empty": true,
            "id-unique": true,
            "spec-char-escape": true
        }))
        .pipe(htmlhint.reporter())
        .pipe(prettify({
            indent_char: ' ',
            indent_size: 4
        }))
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('html:build', function(){
    gulp.src(paths.html_build.src)
        .pipe(plumber()) // Если есть ошибки, выводим и продолжаем
        .pipe(htmlhint({
            "tag-pair": true,
            "style-disabled": true,
            "img-alt-require": true,
            "tagname-lowercase": true,
            "src-not-empty": true,
            "id-unique": true,
            "spec-char-escape": true
        }))
        .pipe(htmlhint.reporter())
        .pipe(prettify({
            indent_char: ' ',
            indent_size: 4
        }))
        .pipe(gulp.dest(paths.html_build.dest));
});

// Собираем html из Jade
gulp.task('jade', function() {
    gulp.src(paths.layouts.src)
    	.pipe(changed('app', {extension: '.html'}))
    	.pipe(plumber()) // Если есть ошибки, выводим и продолжаем
        .pipe(jade({
            pretty: true
        }))
	    .pipe(htmlhint({
	        "tag-pair": true,
	        "style-disabled": true,
	        "img-alt-require": true,
	        "tagname-lowercase": true,
	        "src-not-empty": true,
	        "id-unique": true,
	        "spec-char-escape": true
	    }))
	    .pipe(htmlhint.reporter())
	    .pipe(prettify({
	        indent_char: ' ',
	        indent_size: 4
	    }))
	.pipe(gulp.dest(paths.layouts.dest))
    	.pipe(browserSync.reload({stream:true}));
});

gulp.task('jade:build', function() {
    gulp.src(paths.layouts_build.src)
    	.pipe(changed('app', {extension: '.html'}))
    	.pipe(plumber()) // Если есть ошибки, выводим и продолжаем
        .pipe(jade({
            pretty: true
        }))
	    .pipe(htmlhint({
	        "tag-pair": true,
	        "style-disabled": true,
	        "img-alt-require": true,
	        "tagname-lowercase": true,
	        "src-not-empty": true,
	        "id-unique": true,
	        "spec-char-escape": true
	    }))
	    .pipe(htmlhint.reporter())
	    .pipe(prettify({
	        indent_char: ' ',
	        indent_size: 4
	    }))
    .pipe(gulp.dest(paths.layouts_build.dest));
});

// Собираем JS
gulp.task('js', function() {
    gulp.src(paths.javascripts.src)
    	.pipe(plumber()) // Если есть ошибки, выводим и продолжаем
        .pipe(concat('index.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
        //.pipe(uglify()) // минификация
        .pipe(header(banner, { package : package }))
        .pipe(gulp.dest(paths.javascripts.dest))
        .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('js:build', function() {
    gulp.src(paths.javascripts_build.src)
    	.pipe(plumber()) // Если есть ошибки, выводим и продолжаем
        .pipe(concat('index.js'))
        //.pipe(uglify()) // минификация
        .pipe(header(banner, { package : package }))
        .pipe(gulp.dest(paths.javascripts_build.dest));
});

// Копируем и минимизируем изображения
gulp.task('images', function() {
    gulp.src(paths.images.src)
    	.pipe(changed(paths.images.dest))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [optipng({ optimizationLevel: 3 })]
        }))
        .pipe(gulp.dest(paths.images.dest));
});
gulp.task('images:build', function() {
    gulp.src(paths.images_build.src)
    	.pipe(changed(paths.images_build.dest))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [optipng({ optimizationLevel: 3 })]
        }))
        .pipe(gulp.dest(paths.images_build.dest));
});

gulp.task('webp', function () {
    return gulp.src(paths.webp.src)
        .pipe(webp({
        	quality: 95
        }))
        .pipe(gulp.dest(paths.webp.dest));
});
gulp.task('webp:build', function () {
    return gulp.src(paths.webp_build.src)
        .pipe(webp())
        .pipe(gulp.dest(paths.webp_build.dest));
});

gulp.task('zip', function () {
    gulp.src('assets/*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('build'));
});

//
// .. Clean
//
gulp.task('clean', function() {
  return gulp.src('build', {read: false})
    .pipe(clean());
});

// Browser-sync
gulp.task('browser-sync', function(){
    browserSync.init(null, {
        server: {
            baseDir: 'public'
        }
    });
});
gulp.task('bs-reload', function () {
	browserSync.reload();
});

//
// .. Copy // Копируем, что не должно компилиться
//
gulp.task('copy:css', function() {
  gulp.src(paths.copycss.src)
    .pipe(gulp.dest(paths.copycss.dest));
});
gulp.task('copydev:css', function() {
  gulp.src(paths.copycss_build.src)
    .pipe(gulp.dest(paths.copycss_build.dest));
});

gulp.task('copy:js', function() {
  gulp.src(paths.copyjs.src)
    .pipe(gulp.dest(paths.copyjs.dest));
});
gulp.task('copydev:js', function() {
  gulp.src(paths.copyjs_build.src)
    .pipe(gulp.dest(paths.copyjs_build.dest));
});

/*gulp.task('copy:images', function() {
  gulp.src(paths.copyimg.src)
    .pipe(gulp.dest(paths.copyimg.dest));
});
gulp.task('copydev:images', function() {
  gulp.src(paths.copyimg_build.src)
    .pipe(gulp.dest(paths.copyimg_build.dest));
});*/

gulp.task('copy:fonts', function() {
  gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest));
});
gulp.task('copydev:fonts', function() {
  gulp.src(paths.fonts_build.src)
    .pipe(gulp.dest(paths.fonts_build.dest));
});

gulp.task('copy:files', function() {
  gulp.src(paths.files.src)
    .pipe(gulp.dest(paths.files.dest));
});
gulp.task('copydev:files', function() {
  gulp.src(paths.files_build.src)
    .pipe(gulp.dest(paths.files_build.dest));
});

// Gulp watch with browser-sync
gulp.task('watch', function(){

    // Копируем, что не должно компилиться
    //gulp.src('assets/styles/**/*.css').pipe(gulp.dest('public/css/'));
    //gulp.src('assets/js/libs/*').pipe(gulp.dest('public/js/libs/'));
    //gulp.src('assets/static/**/*').pipe(gulp.dest('public/'));
    //gulp.src('assets/img/**/*').pipe(gulp.dest('public/img/'));

    // At start
    gulp.start('stylus');
    //gulp.start('sass');
    gulp.start('html');
    gulp.start('jade');
    gulp.start('images');
    gulp.start('webp');
    gulp.start('js');
    gulp.start('copy:css');
    gulp.start('copy:js');
    //gulp.start('copy:images');
    gulp.start('copy:fonts');
    gulp.start('copy:files');
    gulp.start('browser-sync');

    gulp.watch(paths.stylesheets.src, ['stylus']);
    //gulp.watch(paths.stylesheets.src, ['sass']);
    gulp.watch(paths.html.src, ['html']);
    gulp.watch(paths.layouts.src, ['jade']);
    gulp.watch(paths.images.src, ['images']);
    gulp.watch(paths.webp.src, ['webp']);
    //gulp.watch(paths.javascripts.src, ['js']);
    gulp.watch(paths.copycss.src, ['copy:css']);
    gulp.watch(paths.copyjs.src, ['copy:js']);
    //gulp.watch(paths.copyimg.src, ['copy:images']);
    gulp.watch(paths.fonts.src, ['copy:fonts']);
    gulp.watch(paths.files.src, ['copy:files']);
    gulp.watch("public/*.html", ['bs-reload']);
});


//****************************************************************************************************
//
// .. RUN
//
//****************************************************************************************************
gulp.task('default', ['browser-sync', 'watch']);

gulp.task('dev', ['clean'], function() {
  gulp.start(
    'stylus',
    //'sass',
    'html',
    'jade',
    //'js',
    'copy:css',
    'copy:js',
    //'copy:images',
    'images',
    'webp',
    'copy:fonts',
    'copy:files'
  );
});

gulp.task('build', ['clean'], function() {
  gulp.start(
    'stylus:build',
    //'sass:build',
    'html:build',
    'jade:build',
    'js:build',
    'images:build',
    //'copydev:images',
    'webp:build',
    'copydev:css',
    'copydev:js',
    'copydev:fonts',
    'copydev:files'
  );
});
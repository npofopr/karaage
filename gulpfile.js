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
    stylus = require('gulp-stylus'), // Плагин для Stylus
    autoprefixer = require('gulp-autoprefixer'), // Расстановка префиксов
    csso = require('gulp-csso'), // Минификация CSS
    csscomb = require('gulp-csscomb'),
    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin'), // Минификация изображений
    svgo = require('imagemin-svgo'),
    optipng = require('imagemin-optipng'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    ignore = require('gulp-ignore'),
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    browserSync = require('browser-sync'), // livereload
    zip = require('gulp-zip'), // Архив собранного проекта
    plumber = require('gulp-plumber'),
    path = require('path');

//****************************************************************************************************
//
// .. TASKS
//
//****************************************************************************************************

var paths = {
    layouts: {
        src: ['./assets/template/*.jade', '!assets/template/_*.jade'],
        dest: './public'
    },
    layouts_build: {
        src: ['./assets/template/*.jade', '!assets/template/_*.jade'],
        dest: './build'
    },
    html: {
        src: ['./assets/**/*.html'],
        dest: './public'
    },
    html_build: {
        src: ['./assets/**/*.html'],
        dest: './build'
    },
    stylesheets: {
        src: './assets/styles/**/*.styl',
        dest: './public/css'
    },
    stylesheets_build: {
        src: './assets/styles/**/*.styl',
        dest: './build/css'
    },
    javascripts: {
        src: ['./assets/js/**/*.js', '!assets/js/libs/**/*.js'],
        dest: './public/js'
    },
    javascripts_build: {
        src: ['./assets/js/**/*.js', '!assets/js/libs/**/*.js'],
        dest: './build/js'
    },
    images: {
        src: './assets/img/**/*',
        dest: './build/img'
    },
    copycss: {
        src: './assets/styles/**/*.css',
        dest: './public/css'
    },
    copycss_build: {
        src: './assets/styles/**/*.css',
        dest: './build/css'
    },
    copyjs: {
        src: './assets/js/**/*',
        dest: './public/js'
    },
    copyjs_build: {
        src: './assets/js/libs/*',
        dest: './build/js/libs'
    },
    copyimg: {
        src: './assets/img/**/*',
        dest: './public/img'
    },
    fonts: {
        src: './assets/fonts/**/*',
        dest: './public/fonts'
    },
    fonts_build: {
        src: './assets/fonts/**/*',
        dest: './build/fonts'
    },
    files: {
        src: './assets/static/**/*',
        dest: './public'
    },
    files_build: {
        src: './assets/static/**/*',
        dest: './build'
    },
    zip: {
        src: './assets/*',
        dest: './build'
    }
};


// Собираем Stylus
gulp.task('stylus', function() {
    gulp.src(paths.stylesheets.src)
    .pipe(plumber()) // Если есть ошибки, выводим и продолжаем
    .pipe(stylus({set:['linenos']})) // собираем stylus
    .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(csscomb({
		"always-semicolon": true,
		"block-indent": "    ",
		"colon-space": ["", " "],
		"color-case": "lower",
		"color-shorthand": true,
		"combinator-space": [" ", " "],
		"element-case": "lower",
		"eof-newline": true,
		"leading-zero": false,
		"quotes": "single",
		"remove-empty-rulesets": true,
		"rule-indent": "    ",
		"stick-brace": " ",
		"strip-spaces": true,
		"unitless-zero": true,
		"vendor-prefix-align": true
    }))
    .pipe(gulp.dest(paths.stylesheets.dest)); // записываем css
});

gulp.task('stylus:build', function() {
    gulp.src(paths.stylesheets.src)
    .pipe(plumber()) // Если есть ошибки, выводим и продолжаем
    .pipe(stylus({set:['linenos']})) // собираем stylus
    .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(csscomb({
		"always-semicolon": true,
		"block-indent": "    ",
		"colon-space": ["", " "],
		"color-case": "lower",
		"color-shorthand": true,
		"combinator-space": [" ", " "],
		"element-case": "lower",
		"eof-newline": true,
		"leading-zero": false,
		"quotes": "single",
		"remove-empty-rulesets": true,
		"rule-indent": "    ",
		"stick-brace": " ",
		"strip-spaces": true,
		"unitless-zero": true,
		"vendor-prefix-align": true
    }))
    .pipe(gulp.dest(paths.stylesheets.dest))
    .pipe(rename("style.min.css"))
    .pipe(csso()) // минимизируем css
    .pipe(gulp.dest(paths.stylesheets.dest)); // записываем css
});

// css
//gulp.task('cssmin', function() {
//    gulp.src('./assets/styles/mincss/*')
//    .pipe(csso())
//    .pipe(gulp.dest('./public/css/min'));
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
        .pipe(gulp.dest(paths.html.dest));
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
    gulp.src(['./assets/template/*.jade', '!assets/template/_*.jade'])
    	.pipe(plumber()) // Если есть ошибки, выводим и продолжаем
        .pipe(jade({
            pretty: true
        }))  // Собираем Jade только в папке ./assets/template/ исключая файлы с _*
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
    .pipe(gulp.dest('./public/'));
}); 

gulp.task('jade:build', function() {
    gulp.src(['./assets/template/*.jade', '!assets/template/_*.jade'])
    	.pipe(plumber()) // Если есть ошибки, выводим и продолжаем
        .pipe(jade({
            pretty: true
        }))  // Собираем Jade только в папке ./assets/template/ исключая файлы с _*
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
    .pipe(gulp.dest('./build/'));
}); 

// Собираем JS
gulp.task('js', function() {
    gulp.src(['./assets/js/**/*.js', '!assets/js/libs/**/*.js'])
    	.pipe(plumber()) // Если есть ошибки, выводим и продолжаем
        .pipe(concat('index.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
        //.pipe(uglify()) // минификация
        .pipe(gulp.dest('./public/js'));
});

gulp.task('js:build', function() {
    gulp.src(['./assets/js/*.js', '!assets/js/libs/**/*.js'])
    	.pipe(plumber()) // Если есть ошибки, выводим и продолжаем
        .pipe(concat('index.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
        //.pipe(uglify()) // минификация
        .pipe(gulp.dest('./build/js'));
});

// Копируем и минимизируем изображения
gulp.task('images', function() {
    gulp.src(paths.images.src)
    	.pipe(newer(paths.images.dest))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [optipng({ optimizationLevel: 3 })]
        }))
        .pipe(gulp.dest(paths.images.dest));
});

gulp.task('zip', function () {
    gulp.src('./assets/*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('build'));
});

//
// .. Clean
//
gulp.task('clean', function() {
  return gulp.src('./build', {read: false})
    .pipe(clean());
});

// Browser-sync
gulp.task('browser-sync', function(){
    browserSync.init(['./public/**/*'], {
        server: {
            host: '127.0.0.1',
            port: '9000',
            baseDir: './public'
        }
    });
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

gulp.task('copy:images', function() {
  gulp.src(paths.copyimg.src)
    .pipe(gulp.dest(paths.copyimg.dest));
});

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
    //gulp.src('./assets/styles/**/*.css').pipe(gulp.dest('./public/css/'));
    //gulp.src('./assets/js/libs/*').pipe(gulp.dest('./public/js/libs/'));
    //gulp.src('./assets/static/**/*').pipe(gulp.dest('./public/'));
    //gulp.src('./assets/img/**/*').pipe(gulp.dest('./public/img/'));
 
    // At start
    gulp.start('stylus');
    gulp.start('html');
    gulp.start('jade');
    //gulp.start('images');
    gulp.start('js');
    gulp.start('copy:css');
    gulp.start('copy:js');
    gulp.start('copy:images');
    gulp.start('copy:fonts');
    gulp.start('copy:files');
    gulp.start('browser-sync');
 
    gulp.watch(paths.stylesheets.src, ['stylus']);
    gulp.watch(paths.html.src, ['html']);
    gulp.watch(paths.layouts.src, ['jade']);
    //gulp.watch(paths.javascripts.src, ['js']);
    gulp.watch(paths.copycss.src, ['copy:css']);
    gulp.watch(paths.copyjs.src, ['copy:js']);
    gulp.watch(paths.copyimg.src, ['images']);
    gulp.watch(paths.fonts.src, ['copy:fonts']);
    gulp.watch(paths.files.src, ['copy:files']);
});


//****************************************************************************************************
//
// .. RUN
//
//****************************************************************************************************
gulp.task('default', ['connect', 'watch']);

gulp.task('dev', ['clean'], function() {
  gulp.start(
    'stylus',
    'html',
    'jade',
    //'js',
    'copy:css',
    'copy:js',
    'copy:images',
    'copy:fonts',
    'copy:files'
  );
});

gulp.task('build', ['clean'], function() {
  gulp.start(
    'stylus:build',
    'html:build',
    'jade:build',
    'js:build',
    'images',
    'copydev:css',
    'copydev:js',
    'copydev:fonts',
    'copydev:files'
  );
});
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
    imagemin = require('gulp-imagemin'), // Минификация изображений
    svgmin = require('gulp-svgmin'), // Минификация svg
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    ignore = require('gulp-ignore'),
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    browserSync = require('browser-sync'); // livereload
    zip = require('gulp-zip'); // Архив собранного проекта

//****************************************************************************************************
//
// .. TASKS
//
//****************************************************************************************************

var paths = {
    layouts: {
        src: ['./assets/template/*.jade', '!assets/template/_*.jade'],
        dest: './build'
    },
    html: {
        src: ['./assets/**/*.html'],
        dest: './build'
    },
    stylesheets: {
        src: './assets/styles/**/*.styl',
        dest: './build/(-;/css'
    },
    copycss: {
        src: './assets/styles/**/*.css',
        dest: './build/(-;/css'
    },
    copyjs: {
        src: './assets/js/libs/*',
        dest: './build/(-;/js/libs'
    },
    javascripts: {
        src: ['./assets/js/**/*.js', '!assets/js/libs/**/*.js'],
        dest: './build/(-;/js'
    },
    images: {
        src: ['./assets/img/**/*', '!assets/img/**/*.svg'],
        dest: './build/(-;/img'
    },
    svg: {
        src: './assets/img/**/*.svg',
        dest: './build/(-;/img'
    },
    fonts: {
        src: './assets/fonts/**/*',
        dest: './build/(-;/fonts'
    },
    files: {
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
        .pipe(stylus({set:['linenos']})) // собираем stylus
    .on('error', console.log) // Если есть ошибки, выводим и продолжаем
    .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(gulp.dest(paths.stylesheets.dest)); // записываем css
});

gulp.task('stylus:build', function() {
    gulp.src(paths.stylesheets.src)
        .pipe(stylus()) // собираем stylus
    .on('error', console.log) // Если есть ошибки, выводим и продолжаем
    .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
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

// Собираем html из Jade
gulp.task('jade', function() {
    gulp.src(paths.layouts.src)
        .pipe(jade({
            pretty: true
        }))  // Собираем Jade только в папке ./assets/template/ исключая файлы с _*
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
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
    .pipe(gulp.dest(paths.layouts.dest));
}); 


// Собираем JS
gulp.task('js', function() {
    gulp.src(paths.javascripts.src)
        .pipe(concat('index.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
        //.pipe(uglify()) // минификация
        .pipe(gulp.dest(paths.javascripts.dest));
});

gulp.task('js:build', function() {
    gulp.src(paths.javascripts.src)
        .pipe(concat('index.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
        //.pipe(uglify()) // минификация
        .pipe(gulp.dest(paths.javascripts.dest));
});

// Копируем и минимизируем изображения
gulp.task('images', function() {
    gulp.src(paths.images.src)
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest(paths.images.dest));
});

gulp.task('svgmin', function() {
    gulp.src(paths.svg.src)
        .pipe(svgmin())
        .pipe(gulp.dest(paths.svg.dest));
});

gulp.task('zip', function () {
    gulp.src(paths.zip.src)
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest(paths.zip.dest));
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
    browserSync.init(['./build/*'], {
        server: {
            host: '127.0.0.1',
            port: '9000',
            baseDir: './build'
        }
    });
});

//
// .. Copy
//
gulp.task('copy:css', function() {
  gulp.src(paths.copycss.src)
    .pipe(gulp.dest(paths.copycss.dest));
});

gulp.task('copy:js', function() {
  gulp.src(paths.copyjs.src)
    .pipe(gulp.dest(paths.copyjs.dest));
});

//gulp.task('copy:images', function() {
//  gulp.src('./assets/img/**/*')
//    .pipe(gulp.dest('./public/img/'));
//});

gulp.task('copy:fonts', function() {
  gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest));
});

gulp.task('copy:files', function() {
  gulp.src(paths.files.src)
    .pipe(gulp.dest(paths.files.dest));
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
    gulp.start('images');
    //gulp.start('svgmin');
    gulp.start('js');
    gulp.start('copy:css');
    gulp.start('copy:js');
    //gulp.start('copy:images');
    gulp.start('copy:fonts');
    gulp.start('copy:files');
    gulp.start('browser-sync');
 
    gulp.watch(paths.stylesheets.src, ['stylus']);
    gulp.watch(paths.html.src, ['html']);
    gulp.watch(paths.layouts.src, ['jade']);
    gulp.watch(paths.javascripts.src, ['js']);
    gulp.watch(paths.copycss.src, ['copy:css']);
    gulp.watch(paths.copyjs.src, ['copy:js']);
    gulp.watch(paths.images.src, ['images']);
    gulp.watch(paths.fonts.src, ['copy:fonts']);
    gulp.watch(paths.files.src, ['copy:files']);
    //gulp.watch('./assets/img/**/*.svg', ['svgmin']);
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
        'js',
        'copy:css',
        'copy:js',
        'images',
        'svgmin',
        'copy:fonts',
        'copy:files'
    );
});

gulp.task('build', ['clean'], function() {
    gulp.start(
        'stylus:build',
        'html',
        'jade',
        'js:build',
        'images',
        'svgmin',
        'copy:css',
        'copy:js',
        'copy:fonts',
        'copy:files'
    );
});
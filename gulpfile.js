// Инициализируем плагины
var lr = require('tiny-lr'), // Минивебсервер для livereload
    gulp = require('gulp'), // Сообственно Gulp JS
    jade = require('gulp-jade'), // Плагин для Jade
    htmlhint = require('gulp-htmlhint'),
    stylus = require('gulp-stylus'), // Плагин для Stylus
    autoprefixer = require('gulp-autoprefixer'), // Расстановка префиксов
    livereload = require('gulp-livereload'), // Livereload для Gulp
    csso = require('gulp-csso'), // Минификация CSS
    imagemin = require('gulp-imagemin'), // Минификация изображений
    svgmin = require('gulp-svgmin'), // Минификация svg
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    cache = require('gulp-cache'),
    //zip = require('gulp-zip'); // Архив собранного проекта
    connect = require('connect'), // Webserver
    server = lr();


// Собираем Stylus
gulp.task('stylus', function() {
    gulp.src('assets/styles/**/*.styl')
        .pipe(stylus()) // собираем stylus
    .on('error', console.log) // Если есть ошибки, выводим и продолжаем
    .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(gulp.dest('public/css/')) // записываем css
    .pipe(livereload(server)); // даем команду на перезагрузку css
});

// html
gulp.task('html', function(){
    gulp.src('assets/**/*.html')
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
        .pipe(gulp.dest('public/'))
        .pipe(livereload(server));
});

// Собираем html из Jade
gulp.task('jade', function() {
    gulp.src(['assets/template/*.jade', '!assets/template/_*.jade'])
        .pipe(jade({
            pretty: true
        }))  // Собираем Jade только в папке ./assets/template/ исключая файлы с _*
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
    .pipe(gulp.dest('public/')) // Записываем собранные файлы
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
    .pipe(gulp.dest('public/'))
    .pipe(livereload(server)); // даем команду на перезагрузку страницы
}); 


// Собираем JS
gulp.task('js', function() {
    gulp.src(['assets/js/**/*.js', '!assets/js/libs/**/*.js'])
        .pipe(concat('index.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
        .pipe(gulp.dest('public/js'))
        .pipe(livereload(server)); // даем команду на перезагрузку страницы
});


// Копируем и минимизируем изображения
gulp.task('images', function() {
    gulp.src(['assets/img/**/*', '!assets/img/**/*.svg'])
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(livereload(server))
        .pipe(gulp.dest('public/img'))
});


gulp.task('svgmin', function() {
    gulp.src('assets/img/**/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('public/img'));
});


/*gulp.task('zip', function () {
    gulp.src('assets/*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('build'));
});*/


// Clean
gulp.task('clean', function() {
    return gulp.src(['build/css', 'build/js', 'build/img'], {read: false})
        .pipe(clean());
});


// Локальный сервер для разработки
gulp.task('http-server', function() {
    connect()
        .use(require('connect-livereload')())
        .use(connect.static('public'))
        .listen('9000');

    console.log('Server listening on http://localhost:9000');
});


// Запуск сервера разработки gulp watch
gulp.task('watch', function() {

    // Копируем, что не должно компилиться
    gulp.src('assets/styles/**/*.css').pipe(gulp.dest('public/css/'));
    gulp.src('assets/js/libs/*').pipe(gulp.dest('public/js/libs/'));
    // gulp.src('assets/**/*.html').pipe(gulp.dest('public/'));
    gulp.src('assets/static/**/*').pipe(gulp.dest('public/'));

    // Предварительная сборка проекта
    gulp.run('stylus');
    gulp.run('html');
    gulp.run('jade');
    gulp.run('images');
    gulp.run('svgmin');
    gulp.run('js');

    // Подключаем Livereload
    server.listen(35729, function(err) {
        if (err) return console.log(err);

        gulp.watch('assets/styles/**/*.styl', function() {
            gulp.run('stylus');
        });
        gulp.watch('assets/**/*.html', function() {
            gulp.run('html');
        });
        gulp.watch('assets/template/**/*.jade', function() {
            gulp.run('jade');
        });
        gulp.watch('assets/img/**/*', function() {
            gulp.run('images');
        });
        gulp.watch('assets/img/**/*.svg', function() {
            gulp.run('svgmin');
        });
        gulp.watch('assets/js/**/*', function() {
            gulp.run('js');
        });
    });
    gulp.run('http-server');
});


gulp.task('build', ['clean'], function() {

    // Копируем, что не должно компилиться
    gulp.src('assets/styles/**/*.css').pipe(gulp.dest('build/css/'));
    gulp.src('assets/js/libs/*').pipe(gulp.dest('build/js/libs/'));
    // gulp.src('assets/**/*.html').pipe(gulp.dest('build/'));
    gulp.src('assets/static/**/*').pipe(gulp.dest('build/'));

    // css
    gulp.src('assets/styles/**/*.styl')
        .pipe(stylus()) // собираем stylus
        .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(gulp.dest('build/css/')) // записываем css
        //.pipe(concat('allstyles.css'))
        .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(gulp.dest('build/css/'))
        .pipe(rename("allstyles.min.css"))
        .pipe(csso()) // минимизируем css
        .pipe(gulp.dest('build/css/')) // записываем css

    // html
    gulp.task('html', function(){
        gulp.src('assets/**/*.html')
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
            .pipe(gulp.dest('build/'))
            .pipe(livereload(server));
    });

    // jade
    gulp.src(['assets/template/*.jade', '!assets/template/_*.jade'])
        .pipe(jade({
            pretty: true
        }))
    .pipe(gulp.dest('build/')) // Записываем собранные файлы
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
    .pipe(gulp.dest('build/'))
    .pipe(livereload(server)); // даем команду на перезагрузку страницы

    // js
    gulp.src(['assets/js/**/*.js', '!assets/js/libs/**/*.js'])
        .pipe(gulp.dest('build/js'))
        .pipe(concat('allscripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));

    // image
    gulp.src(['assets/img/**/*', '!assets/img/**/*.svg'])
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('build/img'));

    gulp.src('assets/img/**/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('build/img'));

});
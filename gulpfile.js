'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer-core'),
    mqpacker = require('css-mqpacker'),
	csswring = require('csswring'),
    jade = require('gulp-jade'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rename = require('gulp-rename'),
    rimraf = require('rimraf'),
    notifier = require('gulp-notify'),
    copy = require('gulp-copy'),
    size = require('gulp-filesize'),
    newer = require('gulp-newer'),
    bump = require('gulp-bump'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    build: {
        html: 'build/',
        jade: 'build/',
        js: 'build/js/',
        css: 'build/style/',
        img: 'build/images/',
        fonts: 'build/fonts/',
        jspartials: 'build/js/partials/'
    },
    src: {
        html: 'src/*.html',
        //jade: 'src/*.jade',
        jade: ['src/*.jade', '!src/_*.jade'],
        js: 'src/js/index.js',
        style: 'src/style/style.css',
        img: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        jspartials: 'src/js/partials/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        jade: 'src/*.jade',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.css',
        img: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        jspartials: 'src/js/partials/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "AVA_frontend"
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}))
        .pipe(size())
        .pipe(notifier('Html Compiled'));
});

gulp.task('jade:build', function () {
    gulp.src(path.src.jade)
        //.pipe(changed('app', {extension: '.html'}))
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(path.build.jade))
        .pipe(reload({stream: true}))
        .pipe(size())
        .pipe(notifier('Jade Compiled'));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(uglify())
        .pipe(rename("index.min.js"))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}))
        .pipe(size())
        .pipe(notifier('JS Compiled'));
});

gulp.task('style:build', function () {
    var processors = [
		autoprefixer({browsers: ['last 4 version', '> 1%', 'ie 8', 'ie 7']}),
		//mqpacker
		//csswring({preserveHacks: true})
	];
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(cssmin())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}))
        .pipe(size())
        .pipe(notifier('Style Compiled, Prefixed and Minified'));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(newer(gulp.dest(path.build.img)))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
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
gulp.task('copy:fonts', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('copy:jspartials', function() {
    gulp.src(path.src.jspartials)
        .pipe(gulp.dest(path.build.jspartials));
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
    'style:build',
    'image:build',
    'copy:fonts',
    'copy:jspartials'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.jade], function(event, cb) {
        gulp.start('jade:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:copy');
    });
    watch([path.watch.jspartials], function(event, cb) {
        gulp.start('jspartials:copy');
    });
});


gulp.task('default', ['build', 'webserver', 'watch']);
gulp.task('update', ['bump', 'npmUpdate']);
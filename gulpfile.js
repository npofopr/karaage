'use strict';

const gulp = require('gulp');

gulp.task('hello', function(callback) {
    console.log("Hello");
    callback();
});

gulp.task('copy', function() {
    return gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('build'));
});

gulp.task('watch', gulp.series('hello'));

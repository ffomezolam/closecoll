var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('default', function() {
    gulp.src('closecoll.js')
        .pipe(uglify())
        .pipe(rename('closecoll.min.js'))
        .pipe(gulp.dest('./'));
});

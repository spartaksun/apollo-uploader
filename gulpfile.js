var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

gulp.task('js', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('lib'))
});

gulp.task('dts', function () {
    return tsProject.src()
        .pipe(tsProject())
        .dts.pipe(gulp.dest('lib'))
});

gulp.task('default', gulp.series('js', 'dts'));

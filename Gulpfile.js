var gulp = require('gulp');
var gulpSeq = require('gulp-sequence');
var jshint = require('gulp-jshint');
var zip = require('gulp-zip');
var concat = require('gulp-concat');
var gls = require('gulp-live-server');
var watch = require('gulp-watch');
var clean = require('gulp-clean');
var server = gls.static('build', 3000);

var pack = require('./package.json');
var serverStarted = false;

/**
 * Main tasks
 */
gulp.task('default', ['run']);

gulp.task('run', ['build'], function () {
    server.start();
    serverStarted = true;
});

gulp.task('dev', gulpSeq('run', 'watch'));

gulp.task('dist', ['build'], function () {
    return gulp.src('src/*')
        .pipe(zip(pack.name + '-' + pack.version + '.zip'))
        .pipe(gulp.dest('dist'));
});

/**
 * Development tasks
 */
gulp.task('watch', function () {
    gulp.watch(['./src/**/*.*', '!./src/js/angular/**/*', '!./src/app.js'], function (event) {
        var base = './src/';
        var task = gulp.src(event.path, {base: base})
            .pipe(gulp.dest('./build'));

        return taskNotifyServer(task);
    });

    gulp.watch(['./src/app.js', './src/js/angular/**/*.js'], ['reload-angular']);
});

gulp.task('reload-angular', function (cb) {
    gulpSeq('jshint', 'join-angular')(cb);
});

/**
 * Build tasks
 */
gulp.task('build', gulpSeq('clean', 'jshint', ['copy-site', 'copy-bower', 'join-angular']));

gulp.task('clean', function () {
    return gulp.src('./build', {read: false})
        .pipe(clean());
});

gulp.task('copy-site', function () {
    var source = ['./src/**/*.*', '!./src/js/angular/**/*', '!./src/app.js'];
    var base = './src/';

    return gulp.src(source, {base: base})
        .pipe(gulp.dest('./build'));
});

gulp.task('copy-bower', function () {
    return gulp.src('./bower_components/**/*')
        .pipe(gulp.dest('./build/js/bower'));
});

gulp.task('join-angular', function () {
    var source = ['./src/app.js', './src/js/angular/**/*.js'];
    var base = './src/';

    var task = gulp.src(source, {base: base})
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./build'));

    return taskNotifyServer(task);
});

/**
 * Code inspection tasks
 */
gulp.task('jshint', function () {
    return gulp.src('./src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

function taskNotifyServer(task) {
    (function () {
        var data = [];

        task.on('data', function (event) {
            data.push(event);
        });

        task.on('end', function () {
            if (serverStarted && data.length > 0) {
                server.notify.apply(server, data);
            }
        });
    })();

    return task;
}
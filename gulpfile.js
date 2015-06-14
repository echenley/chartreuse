'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var gutil = require('gulp-util');
var notify = require('gulp-notify');
var size = require('gulp-size');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var exit = require('gulp-exit');
var plumber = require('gulp-plumber');
var svgmin = require('gulp-svgmin');
var del = require('del');

var srcDir = './src/';
var buildDir = './build/';
var distDir = './dist/';

var jsEntry = 'Chartreuse';
var sassEntry = 'src/scss/*.scss';

function handleError() {
    gutil.beep();
    notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
    }).apply(this, arguments);

    // Keep gulp from hanging on this task
    this.emit('end');
}

function buildScript(file) {
    var props = watchify.args;
    props.entries = [srcDir + 'js/' + file];
    props.debug = true;

    var bundler = watchify(browserify(props), { ignoreWatch: true })
        .transform(babelify.configure({
            only: /(src\/js)/
        }));

    function rebundle() {
        gutil.log('Rebundle...');
        var start = Date.now();
        return bundler.bundle()
            .on('error', handleError)
            .pipe(source(jsEntry.toLowerCase() + '.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(buildDir))
            .pipe(notify(function() {
                console.log('Rebundle Complete [' + (Date.now() - start) + 'ms]');
            }));
    }

    bundler.on('update', rebundle);
    return rebundle();
}

gulp.task('styles', function() {
    return gulp.src(sassEntry)
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            // compression handled in dist task
            style: 'expanded'
        }))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest(buildDir))
        .pipe(browserSync.stream({ match: '**/*.css' }))
        .pipe(size());
});

gulp.task('svg', function() {
    del(buildDir + 'svg/**/*', function() {
        gulp.src(srcDir + 'svg/*.svg')
            .pipe(svgmin())
            .pipe(gulp.dest(buildDir + 'svg'))
    });
});

gulp.task('html', function() {
    return gulp.src(srcDir + '*.html')
        .pipe(gulp.dest(buildDir))
        .pipe(size());
});

gulp.task('clean', function() {
    del(buildDir + '**/*');
});

gulp.task('serve', ['build'], function() {
    browserSync.init({
        server: {
            baseDir: buildDir
        }
    });

    gulp.watch(srcDir + '*.html', ['html']);
    gulp.watch(srcDir + 'svg/*.svg', ['svg']);
    gulp.watch(srcDir + 'scss/**/*.scss', ['styles']);

    gulp.watch(buildDir).on('change', browserSync.reload);
});

gulp.task('build', ['html', 'styles', 'svg'], function() {
    return buildScript(jsEntry + '.jsx');
});

gulp.task('dist', ['build'], function() {
    var assets = useref.assets();

    // move svgs to /dist
    gulp.src(buildDir + 'svg/*.svg')
        .pipe(gulp.dest(distDir + 'svg'));

    // minify css/js and move index.html to /dist
    return gulp.src('build/*.html')
        .pipe(plumber())
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifycss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(distDir))
        .pipe(exit());
});

gulp.task('default', ['serve']);

/* global require */

var gulp = require('gulp');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');

// See the cssmin documentation for more details
var cssMinSettings = {
    keepSpecialComments: 0
};

// See the uglify documentation for more details
var uglifySettings = {
    compress: {
        comparisons: true,
        conditionals: true,
        dead_code: true,
        drop_console: true,
        unsafe: true,
        unused: true
    }
};

// Assets for the project
var Assets = {
    css: {
        dist: 'css',
        custom: {
            main: 'styles.css',
            minified: 'styles.min.css'
        },
        vendor: {
            // main: 'vendor.css',
            minified: 'vendor.min.css'
        }
    },
    js: {
        dist: 'js',
        custom: {
            all: [
                // Note: js is the same as Assets.js.dist

                // Select all js file(s) include sub-directories
                './js/**/*.js',

                // Ignore all js file(s) that have the .min.js prefix
                '!./js/**/*.min.js'
            ],
            // main: 'scripts.js',
            minified: 'scripts.min.js'
        },
        vendor: {
            // main: 'vendor.js',
            minified: 'vendor.min.js'
        }
    }
};

// Clean the current directory
gulp.task('clean', function (cb) {
    del([
        './' + Assets.css.dist + '/' + Assets.css.custom.minified,
        './' + Assets.js.dist + '/' + Assets.js.custom.minified
    ], cb);
});

// Minify the main css file
gulp.task('cssmin', function () {
    // Clean the css dist directory
    del(['./' + Assets.css.dist + '/' + Assets.css.custom.minified]);

    return gulp.src('./' + Assets.css.dist + '/' + Assets.css.custom.main)
        .pipe(cssmin(uglifySettings))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./' + Assets.css.dist));
});

// Check the code meets the following standards outlined in .jshintrc
gulp.task('jshint', function () {
    return gulp.src(Assets.js.custom.all)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Uglify aka minify all js file(s)
gulp.task('uglify', function () {
    // Clean the js dist directory
    del(['./' + Assets.js.dist + '/' + Assets.js.custom.minified]);

    return gulp.src(Assets.js.custom.all)
        .pipe(concat(Assets.js.custom.minified))
        .pipe(uglify(uglifySettings))
        .pipe(rename(Assets.js.custom.minified))
        .pipe(gulp.dest('./' + Assets.js.dist));
});

// Concat and uglify the vendor scripts/styles
gulp.task('vendor', function () {
    // Copy font-awesome fonts
    gulp.src('./bower_components/font-awesome/fonts/**/*.{eof,svg,ttf,woff,woff2}')
        .pipe(gulp.dest('./fonts'));

    // Concatenate and minify styles
    gulp.src([
            './bower_components/font-awesome/css/font-awesome.css',
            './bower_components/normalize-css/normalize.css',
            './bower_components/skeleton/css/skeleton.css',
            './bower_components/nprogress/nprogress.css',
        ])
        .pipe(concat(Assets.css.vendor.minified))
        .pipe(cssmin(cssMinSettings))
        .pipe(gulp.dest('./' + Assets.css.dist + '/'));

    // Concatenate and uglify scripts
    gulp.src([
            './bower_components/jquery/dist/jquery.js',
            './bower_components/handlebars/handlebars.js',
            './bower_components/momentjs/moment.js',
            './bower_components/jquery-handlebars/jquery-handlebars.js',
            './bower_components/nprogress/nprogress.js',
        ])
        .pipe(concat(Assets.js.vendor.minified))
        .pipe(uglify(uglifySettings))
        .pipe(gulp.dest('./' + Assets.js.dist + '/'));
});

// Watch for changes to the main file(s)
gulp.task('watch', function () {
    gulp.watch(Assets.js.custom.all, ['jshint', 'uglify']);
    gulp.watch('./' + Assets.css.dist + '/' + Assets.css.custom.main, ['cssmin']);
});

// Register the default task
gulp.task('default', ['clean', 'cssmin', 'uglify', 'vendor']);

// 'gulp cssmin' to minify the main css file
// 'gulp jshint' to check the syntax
// 'gulp uglify' to uglify all js file(s)
// 'gulp vendor' to build the vendor file(s)

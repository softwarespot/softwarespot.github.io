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
            main: 'vendor.css',
            minified: 'vendor.min.css'
        }
    },
    js: {
        dist: 'js',
        custom: {
            main: 'scripts.js',
            minified: 'scripts.min.js'
        },
        vendor: {
            main: 'vendor.js',
            minified: 'vendor.min.js'
        }
    }
};

// Clean the current directory
gulp.task('clean', function (cb) {
    del(['./' + Assets.js.dist + '/' + Assets.js.custom.minified], cb);
});

// Minify the main css file
gulp.task('cssmin', function () {
    return gulp.src('./' + Assets.css.dist + '/' + Assets.css.custom.main)
        .pipe(cssmin(uglifySettings))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./' + Assets.css.dist));
});

// Check the code meets the following standards outlined in .jshintrc
gulp.task('jshint', function () {
    return gulp.src('./' + Assets.js.dist + '/' + Assets.js.custom.main)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Uglify aka minify the main js file
gulp.task('uglify', function () {
    return gulp.src('./' + Assets.js.dist + '/' + Assets.js.custom.main)
        .pipe(uglify(uglifySettings))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./' + Assets.js.dist));
});

// Concat and uglify the vendor scripts/styles
gulp.task('vendor', function () {
    // Copy font-awesome fonts
    gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}')
        .pipe(gulp.dest('./fonts'));

    // Concatenate and minify styles
    gulp.src([
            './bower_components/font-awesome/css/font-awesome.css',
            './bower_components/normalize-css/normalize.css',
            './bower_components/skeleton/css/skeleton.css'
        ])
        .pipe(concat(Assets.css.vendor.minified))
        .pipe(cssmin(cssMinSettings))
        .pipe(gulp.dest('./' + Assets.css.dist + '/'));

    // Concatenate and uglify scripts
    gulp.src(['./bower_components/jquery/dist/jquery.js'])
        .pipe(concat(Assets.js.vendor.minified))
        .pipe(uglify())
        .pipe(gulp.dest('./' + Assets.js.dist + '/'));
});

// Watch for changes to the main file(s)
gulp.task('watch', function () {
    gulp.watch('./' + Assets.js.dist + '/' + Assets.js.custom.main, ['jshint', 'uglify']);
    gulp.watch('./' + Assets.css.dist + '/' + Assets.css.custom.main, ['cssmin']);
});

// Register the default task
gulp.task('default', ['clean', 'cssmin', 'uglify', 'vendor']);

// 'gulp cssmin' to minify the main css file
// 'gulp jshint' to check the syntax
// 'gulp uglify' to uglify the main js file

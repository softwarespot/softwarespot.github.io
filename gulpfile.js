/* global require */

var gulp = require('gulp');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var jshint = require('gulp-jshint');
var php = require('gulp-connect-php');
var prettify = require('gulp-jsbeautifier');
var minifyHTML = require('gulp-minify-html');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');

// See the cssmin documentation for more details
var _cssMinSettings = {
    keepSpecialComments: 0,
};

// See the uglify documentation for more details
var _uglifySettings = {
    compress: {
        comparisons: true,
        conditionals: true,
        /* jscs: disable */
        dead_code: true,
        drop_console: true,
        /* jscs: enable */
        unsafe: true,
        unused: true,
    },
};

// Assets for the project
var Assets = {
    css: {
        dest: './build/css',
        source: './css',
        custom: {
            all: [

                // Select all css file(s) include sub-directories
                './css/**/*.css',

                // Ignore all css file(s) that have the .min.css prefix
                '!./css/**/*.min.css',
            ],

            // main: 'styles.css',
            minified: 'styles.min.css',
        },
        vendor: {
            // main: 'vendor.css',
            minified: 'vendor.min.css',
        },
    },
    fonts: {
        dest: './build/fonts',
    },
    html: {
        dest: './',
        source: './html',
        custom: {
            all: [

                // Select all html file(s) include sub-directories
                './html/**/*.html',
            ],
        },
    },
    images: {
        dest: './build/images',
        source: './images/**/*.*',
    },
    js: {
        dest: './build/js',
        source: './js',
        custom: {
            all: [

                // Select all js file(s) include sub-directories
                './js/**/*.js',

                // Ignore all js file(s) that have the .min.js prefix
                '!./js/**/*.min.js',
            ],

            // main: 'scripts.js',
            minified: 'scripts.min.js',
        },
        vendor: {
            // main: 'vendor.js',
            minified: 'vendor.min.js',
        },
    },
};

// Clean the current directory
gulp.task('clean', function cleanTask(cb) {
    del([
        Assets.css.dest + '/**/*.*',
        Assets.images.dest + '/**/*.*',
        Assets.js.dest + '/**/*.*',
    ], cb);
});

// Minify the main css file(s)
gulp.task('cssmin', function cssMinTask() {
    // Store the destination directory
    var dest = Assets.css.dest;

    // Store the source directory
    var source = Assets.css.source;

    // Store the minified filename
    var minified = Assets.css.custom.minified;

    // Clean the css destination directory
    del([dest + '/' + minified]);

    return gulp.src([
            source + '/styles.css',
        ])
        .pipe(concat(minified))
        .pipe(cssmin(_cssMinSettings))
        .pipe(rename(minified))
        .pipe(gulp.dest(dest));
});

// Minify the main html file(s)
gulp.task('htmlmin', function cssMinTask() {
    // Store the destination directory
    var dest = Assets.html.dest;

    // Store the source directory
    var source = Assets.html.source;

    return gulp.src([
            source + '/**/*.html',
        ])
        .pipe(minifyHTML())
        .pipe(gulp.dest(dest));
});

// Copy images to the destination directory
gulp.task('images', function imagesTask() {
    // Copy images to the destination directory
    return gulp.src(Assets.images.source)
        .pipe(gulp.dest(Assets.images.dest));
});

// Check the code meets the following standards outlined in .jshintrc
gulp.task('jshint', function jsHintTask() {
    var all = Assets.js.custom.all;

    return gulp.src(all)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Initialise the PHP server 'php -S localhost:8000'
gulp.task('php-server', function phpSeverTask() {
    php.server({
        hostname: 'localhost',
        port: 8000,
        base: '.',
        keepalive: true,
        open: true,

        // bin: '',
        // ini: '',
    });
});

// Prettify the main js file(s)
gulp.task('prettify-js', function prettifyJSTask() {
    var all = Assets.js.custom.all;

    // Store the source directory
    var source = Assets.js.source;

    gulp.src(all)
        .pipe(prettify({
            config: '.jsbeautifyrc',
            mode: 'VERIFY_AND_WRITE',
        }))
        .pipe(gulp.dest(source));
});

// Uglify aka minify the main js file(s)
gulp.task('uglify', function uglifyTask() {
    // Store the destination directory
    var dest = Assets.js.dest;

    // Store the source directory
    var source = Assets.js.source;

    // Store the minified filename
    var minified = Assets.js.custom.minified;

    // Clean the js destination directory
    del([dest + '/' + minified]);

    return gulp.src([
            source + '/core.js',
            source + '/core.api.js',
            source + '/core.features.js',
            source + '/gists.js',
            source + '/main.js',
            source + '/navigation.js',
        ])
        .pipe(concat(minified))
        .pipe(uglify(_uglifySettings))
        .pipe(rename(minified))
        .pipe(gulp.dest(dest));
});

// Concat and uglify the vendor scripts/styles
gulp.task('vendor', function vendorTask() {
    // Store the bower_components directory
    var bowerComponents = './bower_components/';

    // Copy fonts to the destination directory
    gulp.src([
            bowerComponents + 'font-awesome/fonts/**/*.{eof,svg,ttf,woff,woff2}',
            bowerComponents + 'open-sans/fonts/**/*.{eof,svg,ttf,woff,woff2}',
        ])
        .pipe(gulp.dest(Assets.fonts.dest));

    // Store the css destination directory
    var cssDest = Assets.css.dest;

    // Store the css minified filename
    var cssMinified = Assets.css.vendor.minified;

    // Concatenate and minify styles
    gulp.src([
            bowerComponents + 'font-awesome/css/font-awesome.css',
            bowerComponents + 'open-sans/css/open-sans.css',
            bowerComponents + 'normalize-css/normalize.css',
            bowerComponents + 'skeleton/css/skeleton.css',
            bowerComponents + 'nprogress/nprogress.css',
        ])
        .pipe(concat(cssMinified))
        .pipe(cssmin(_cssMinSettings))
        .pipe(gulp.dest(cssDest));

    // Store the js destination directory
    var jsDest = Assets.js.dest;

    // Store the js minified filename
    var jsMinified = Assets.js.vendor.minified;

    // Concatenate and uglify scripts
    gulp.src([
            bowerComponents + 'jquery/dist/jquery.js',
            bowerComponents + 'handlebars/handlebars.js',
            bowerComponents + 'momentjs/moment.js',
            bowerComponents + 'jquery-handlebars/jquery-handlebars.js',
            bowerComponents + 'nprogress/nprogress.js',
        ])
        .pipe(concat(jsMinified))
        .pipe(uglify(_uglifySettings))
        .pipe(gulp.dest(jsDest));
});

// Build the main css and js file(s)
gulp.task('build', ['cssmin', 'htmlmin', 'uglify']);

// Watch for changes to the main css and js file(s)
gulp.task('watch', function watchTask() {
    gulp.watch(Assets.css.custom.all, ['cssmin']);
    gulp.watch(Assets.js.custom.all, ['jshint', 'uglify']);
});

// Register the default task which is essentially 'build' and 'vendor' included
gulp.task('default', ['clean', 'build', 'images', 'vendor']);

// 'gulp build' to build the main css and js file(s)
// 'gulp cssmin' to minify the main css file(s)
// 'gulp htmlmin' to minify the main html file(s)
// 'gulp images' to copy images files to the destination directory
// 'gulp jshint' to check the syntax of the main js file(s)
// 'gulp php-server' to connect to the local PHP server
// 'gulp prettify-js' to prettify the main js file(s)
// 'gulp uglify' to uglify the main js file(s)
// 'gulp vendor' to build the vendor file(s)
// 'gulp watch' to watch for changes to the main css and js file(s)
// 'gulp' to build everything

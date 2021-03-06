const { src, dest, series, parallel, watch } = require('gulp');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

const paths = {
    working: {
        scss: './src/scss/*.scss',
        js: './src/js/*.js',
        assets: ['./src/assets/**', '!./src/assets/*.psd'],
        html: ['./src/*.html', './src/favicon.ico'],
        fonts: ['./src/fonts/**', './node_modules/@fortawesome/fontawesome-free/webfonts/**']
    },
    dist: {
        all: './dist/**',
        css: './dist/css/',
        js: './dist/js/',
        assets: './dist/assets/',
        html: './dist/',
        fonts: './dist/fonts/'
    }
};

function cleanDist(done) {
    del('./dist/**');
    done();
}

/**
 * compile and copy styles to dist folder
 */
function styles() {
    const files = [
        paths.working.scss
    ];

    const opts = {outputStyle: 'compressed', };

    return src(files, {sourcemaps: true})
        .pipe(sass(opts))
        .on('error', sass.logError)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(concat('styles.min.css'))
        .pipe(dest(paths.dist.css, {sourcemaps: true}))
        .pipe(browserSync.stream());
}

/**
 * compile and copy scripts to dist folder
 */
function scripts() {
    const files = [
        './node_modules/jquery/dist/jquery.slim.js',
        paths.working.js
    ];

    return src(files, {sourcemaps: true})
        .pipe(uglify())
        .pipe(concat('scripts.min.js'))
        .pipe(dest(paths.dist.js, {sourcemaps: true}))
        .pipe(browserSync.stream());
}

/**
 * copy html files to dist folder
 */
function copyHtml() {
    return src(paths.working.html)
        .pipe(dest(paths.dist.html))
        .pipe(browserSync.stream());
}

/**
 * copy CNAME file to dist folder
 */
function copyCname() {
    return src('./src/CNAME')
        .pipe(dest(paths.dist.html))
        .pipe(browserSync.stream());
}

/**
 * copy assets to dist folder
 */
function copyAssets() {
    return src(paths.working.assets)
        .pipe(dest(paths.dist.assets))
        .pipe(browserSync.stream());
}

/**
 * copy fonts to dist folder
 */
function copyFonts() {
    return src(paths.working.fonts)
        .pipe(dest(paths.dist.fonts));
}

function reload(done) {
    browserSync.reload();
    done();
}

function watchFiles() {
    browserSync.init({
        port: 8080,
        server: paths.dist.html,
        notify: false
    });

    watch(paths.working.scss, series(styles, reload));
    watch(paths.working.js, series(scripts, reload));
    watch(paths.working.html, series(copyHtml, reload));
    watch(paths.working.assets, series(copyAssets, reload));
}

const buildFiles = series(cleanDist, parallel(copyHtml, copyCname, copyAssets, styles, scripts, copyFonts));
const serveFiles = series(cleanDist, copyHtml, copyCname, copyAssets, copyFonts, styles, scripts, watchFiles);

exports.build = buildFiles;
exports.serve = serveFiles;

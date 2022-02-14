const { src, dest, series, parallel, watch } = require('gulp');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const uglify = require('gulp-uglify');
const mergeStream = require('merge-stream');
const browserSync = require('browser-sync').create();

const paths = {
    working: {
        scss: './src/scss/*.scss',
        js: './src/js/*.js',
        assets: ['./src/assets/**', '!./src/assets/*.psd'],
        html: './src/*.html',
        fonts: './src/fonts/**'
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

// HOW CAN I COMBINE THESE 2 INTO ONE FUNCTION? APPARENTLY MERGESTREAM DOES NOT LIKE
// BEING INSIDE A SERIES.... WHAT A DIVA!
function copyHtml() {
    const htmlCopy = src(paths.working.html).pipe(dest(paths.dist.html));
    // const assetsCopy = src(paths.working.assets).pipe(dest(paths.dist.assets));

    return htmlCopy;
}
function copyAssets() {
    // const htmlCopy = src(paths.working.html).pipe(dest(paths.dist.html));
    const assetsCopy = src(paths.working.assets).pipe(dest(paths.dist.assets));

    return assetsCopy;
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
    watch(paths.working.html, reload);
    watch(paths.working.assets, reload);
}

const buildFiles = series(cleanDist, parallel(copyHtml, copyAssets, styles, scripts));
const serveFiles = series(cleanDist, copyHtml, copyAssets, styles, scripts, watchFiles);
// const serveFiles = series(cleanDist, parallel(copyFiles, styles, scripts), watchFiles);

exports.build = buildFiles;
exports.serve = serveFiles;

exports.clean = cleanDist;
// exports.copy = copyFiles;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watchFiles;

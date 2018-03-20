/*eslint no-console: 0*/

(function() {
    'use strict'

    const argv = require('yargs')
        .argv
    const gulp = require('gulp')
    const watch = require('gulp-watch')
    const sass = require('gulp-sass')
    const minify = require('gulp-minify')
    const babel = require('gulp-babel')
    const imagemin = require('gulp-imagemin')
    const browserSync = require('browser-sync')
        .create()

    const ROOT = __dirname

    const config = {
        src: {
            js: ROOT + '/src/js/*.js',
            sass: ROOT + '/src/sass/*.sass',
            html: ROOT + '/src/html/*.html',
            images: ROOT + '/src/images/**/*'
        },
        dest: {
            js: ROOT + '/dest/js',
            sass: ROOT + '/dest/css',
            images: ROOT + '/dest/images',
            html: ROOT + '/dest/'
        }
    }
    const env = argv.env === undefined || argv.env === 'dev' ? 'dev' : 'prod'

    const minifySASS = function() {
        return gulp
            .src(config.src.sass)
            .pipe(
                sass({
                    outputStyle: 'compressed'
                })
                .on('error', sass.logError)
            )
            .pipe(gulp.dest(config.dest.sass))
            .pipe(browserSync.stream())
    }

    const minifyHTML = function() {
        return gulp
            .src(config.src.html)
            .pipe(gulp.dest(config.dest.html))
            .on('end', () => {
                if (env === 'dev') {
                    browserSync.reload()
                }
            })
    }

    const watchMinifyJS = file => {
        gulp
            .src(file)
            .pipe(
                babel({
                    presets: ['env']
                })
                .on('error', o => {
                    console.log(o)
                })
            )
            .pipe(
                minify({
                    noSource: false,
                    ext: {
                        min: '-min.js'
                    }
                })
                .on('error', o => {
                    console.log(o)
                })
            )
            .pipe(gulp.dest(config.dest.js))
            .on('end', function() {
                browserSync.reload()
            })
            .on('error', function(err) {
                console.log(err)
            })
    }

    gulp.task('minifyjs', function() {
        return gulp
            .src(config.src.js)
            .pipe(
                babel({
                    presets: ['env']
                })
                .on('error', o => {
                    console.log(o)
                })
            )
            .pipe(
                minify({
                    noSource: false,
                    ext: {
                        min: '-min.js'
                    }
                })
                .on('error', o => {
                    console.log(o)
                })
            )
            .pipe(gulp.dest(config.dest.js))
            .on('error', function(err) {
                console.log(err)
            })
    })
    gulp.task('minifyjs-watch', ['minifyjs'], function(cb) {
        browserSync.reload()
        cb()
    })

    gulp.task('minifysass', function() {
        minifySASS()
    })

    gulp.task('minifyHTML', function() {
        minifyHTML()
    })

    gulp.task('minifyimage', function() {
        return gulp
            .src(config.src.images)
            .pipe(
                imagemin()
            )
            .pipe(gulp.dest(config.dest.images))
            .on('error', function(err) {
                console.log(err)
            })
    })

    gulp.task('minify', ['minifyjs', 'minifysass', 'minifyHTML', 'minifyimage'])

    gulp.task('browser-sync', function() {
        browserSync.init({
            startPath: '/index.html',
            server: {
                baseDir: './dest'
            },
            open: false,
            https: {
                key: 'server.key',
                cert: 'server.crt'
            },
            logConnections: false,
            injectChanges: true,
            serveStatic: [{
                    route: '/images',
                    dir: './dest/images'
                },
                {
                    route: '/css',
                    dir: './dest/css'
                }, {
                    route: '/js',
                    dir: './dest/js'
                }
            ]
        })
    })

    gulp.task('watch', ['browser-sync'], function() {
        watch(
            [config.src.js, config.src.sass, config.src.html], {
                verbose: true
            },
            function(event) {
                if (/\.js$/i.test(event.path)) {
                    watchMinifyJS(event.path)
                } else if (/\.sass$/i.test(event.path)) {
                    minifySASS()
                } else if (/\.html$/i.test(event.path)) {
                    minifyHTML()
                }
            }
        )
    })
})()

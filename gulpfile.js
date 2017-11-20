(function() {
    'use strict'

    const gulp = require('gulp')
    const watch = require('gulp-watch')
    const sass = require('gulp-sass')
    const browserSync = require('browser-sync').create()

    const config = {
        src: {
            js: './src/js/*.js',
            sass: './src/sass/*.sass',
            html: './src/html/*.html'
        },
        dest: {
            js: './dest/public/js',
            sass: './dest/public/css',
            html: './dest/'
        }
    }

    const minifyJS = function() {
        return gulp
            .src(config.src.js)
            .pipe(gulp.dest(config.dest.js))
            .pipe(browserSync.reload({ stream: true, once: true }))
    }

    const minifySASS = function() {
        return gulp
            .src(config.src.sass)
            .pipe(sass({ outputStyle: 'compressed' }))
            .pipe(gulp.dest(config.dest.sass))
            .pipe(browserSync.stream())
    }

    const minifyHTML = function() {
        return gulp.src(config.src.html)
            .pipe(gulp.dest(config.dest.html))
            .pipe(browserSync.reload({ stream: true, once: true }))
    }

    gulp.task('minifyjs', function() {
        minifyJS()
    })

    gulp.task('minifysass', function() {
        minifySASS()
    })

    gulp.task('minify', ['minifyjs', 'minifysass', 'minifyHTML'])

    gulp.task('browser-sync', function() {
        browserSync.init({
            server: {
                baseDir: './dest'
            }
        })
    })

    gulp.task('watch', ['browser-sync'], function() {
        watch(
            [config.src.js, config.src.sass, config.src.html],
            {
                verbose: true
            },
            function(event) {
                if (/\.js$/i.test(event.path)) {
                    minifyJS()
                } else if (/\.sass$/i.test(event.path)) {
                    minifySASS()
                } else if (/\.html$/i.test(event.path)) {
                    minifyHTML()
                }
            }
        )
    })
})()

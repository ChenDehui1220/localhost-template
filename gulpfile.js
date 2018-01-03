;(function() {
  'use strict'

  const gulp = require('gulp')
  const watch = require('gulp-watch')
  const sass = require('gulp-sass')
  const minify = require('gulp-minify')
  //   const runSequence = require('run-sequence')
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

  const minifySASS = function() {
    return gulp
      .src(config.src.sass)
      .pipe(sass({ outputStyle: 'compressed' }))
      .pipe(gulp.dest(config.dest.sass))
      .on('end', () => {
        browserSync.stream()
      })
  }

  const minifyHTML = function() {
    return gulp
      .src(config.src.html)
      .pipe(gulp.dest(config.dest.html))
      .on('end', () => {
        browserSync.reload()
      })
  }

  const watchMinifyJS = file => {
    gulp
      .src(file)
      .pipe(
        minify({
          noSource: true,
          ext: {
            min: '.js'
          }
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
        minify({
          ext: {
            min: '-min.js'
          }
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

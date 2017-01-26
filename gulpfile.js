var gulp = require('gulp')
var gutil = require('gulp-util')
var source = require('vinyl-source-stream')
var babelify = require('babelify')
var browserify = require('browserify')
var sourcemaps = require('gulp-sourcemaps')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var buffer = require('vinyl-buffer')
var watchify = require('watchify')
var streamify = require('gulp-streamify')
var cssmin = require('gulp-cssmin')
var sass = require('gulp-sass')


var deps = ['jquery', 'd3', 'd3-tip', 'materialize-css']

var cssDeps = ['./node_modules/materialize-css/sass/styles.scss']

gulp.task('vendor', function(){
  return browserify()
           .require(deps)
           .bundle()
           .pipe(source('vendor.min.js'))
           .pipe(streamify(uglify({mangle:false})))
           .pipe(gulp.dest('./public/js'))
})

gulp.task('bundle', function(){
  return browserify({entries: 'app/scripts/main.js'})
            .external(deps)
            .transform(babelify, {presets:['es2015']})
            .bundle()
            .pipe(source('bundle.min.js'))
            .pipe(buffer())
            // .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(streamify(uglify({mangle: false})))
            // .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('./public/js'))
})


gulp.task('bundle-watch', function(){
  var bundler = watchify(browserify({entries:'app/scripts//main.js', debug:true}, watchify.args));
  bundler.external(deps);
  bundler.transform(babelify, {presets: ['es2015']});
  bundler.on('update', rebundle);
  return rebundle();

  function rebundle(){
    bundler.bundle()
           .on('error', function(err){
            gutil.log(gutil.colors.red(err.toString()))
           })
           .on('end', function(){
            gutil.log(gutil.colors.green('Finished Rebundle'))
           })
           .pipe(source('bundle.min.js'))
           .pipe(streamify(uglify({mangle: false})))
           .pipe(streamify(sourcemaps.init({loadMaps: true})))
           .pipe(streamify(sourcemaps.write('.')))
           .pipe(gulp.dest('./public/js'))
  }
})



gulp.task('vendor-styles', function(){
  return gulp.src(cssDeps)
             .pipe(sourcemaps.init())
             .pipe(sass())
             .pipe(cssmin())
             .pipe(concat('vendor.min.css'))
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest('./public/css'))
})


gulp.task('bundle-styles', function(){
    return gulp.src('app/styles/*.scss')
               .pipe(sass().on('error', sass.logError))
               .pipe(sourcemaps.init())
               .pipe(cssmin())
               .pipe(concat('bundle.min.css'))
               .pipe(sourcemaps.write('.'))
               .pipe(gulp.dest('./public/css'))
})

gulp.task('datePicker-copy', function(){
  return gulp.src('./node_modules/materialize-css/js/date_picker/picker.js')
             .pipe(gulp.dest('./node_modules/materialize-css/bin'))
})

gulp.task('copy-fonts', function(){
  return gulp.src('./node_modules/materialize-css/fonts/**/*')
             .pipe(gulp.dest('./public/fonts'))
})



gulp.task('default', ['datePicker-copy', 'copy-fonts', 'vendor-styles', 'vendor'], function(){
  gulp.watch('app/**/*.js', ['bundle-watch'])
  gulp.watch('app/styles/*.scss', ['bundle-styles'])
})
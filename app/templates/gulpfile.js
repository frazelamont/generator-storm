// generated on 2016-08-11 using generator-storm 1.0.0

/*global require*/
/* Require the gulp and node packages */
var gulp = require('gulp'),
    pkg = require('./package.json'),
    del = require('del'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    pixrem = require('gulp-pixrem'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    swig = require('gulp-swig'),
    frontMatter = require('gulp-front-matter'),
    data = require('gulp-data'),
    pagespeed = require('psi'),
    extname = require('gulp-extname'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    path = require('path'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    debug = require('gulp-debug'),
    runSequence = require('run-sequence'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    jshint = require('gulp-jshint'),
    nconf = require('nconf'),
    gulpif = require('gulp-if'),
    jshintConfig = pkg.jshintConfig;

/* Set up the banner */
var banner = [
    '/**',
    ' * @name ' + (pkg.name || "") + ': ' + (pkg.description || ""),
    ' * @version ' + (pkg.version || '0.1.0') + ': ' + new Date().toUTCString(),
    ' * @author ' + (pkg.author || 'Storm ID'),
    ' * @license ' + (pkg.license || 'Storm ID'),
    ' */',
    ' '
].join('\n');


// = Options
//-----------------------------------------------------------------------------//

var options = { paths: { }, production: false };
nconf
    .argv()
    .file({ file: 'gulpfile.config.json' });
var options = nconf.get();

/* Set the PSI variables */
var publicUrl = '', //publicly accessible URL on your local machine, demo, staging, live...
    psiStrategy = 'mobile'; //'mobile' or 'desktop'

/* Error notificaton*/
var onError = function(err) {
    notify.onError({
        title:    "Gulp",
        subtitle: "Failure!",
        sound:    "Beep"
    })(err);

    this.emit('end');
};

/************************
 *  Task definitions 
 ************************/
gulp.task('clean:js', function () {
  return del(options.paths.dist.js);
});

gulp.task('clean:css', function () {
  return del(options.paths.dist.css);
});

gulp.task('clean:html', function () {
  return del(options.paths.dist.html);
});

gulp.task('clean:img', function () {
  return del(options.paths.dist.img);
});

gulp.task('clean:fonts', function () {
  return del(options.paths.dist.fonts);
});

gulp.task('clean',['clean:css', 'clean:js', 'clean:html', 'clean:img', 'clean:fonts']);

/* Lint JS */
gulp.task('lint', function() {
  return gulp.src(options.paths.src.js)
    .pipe(jshint(jshintConfig))
    .pipe(jshint.reporter('default'));
});

gulp.task('js:browserify', function () {
  var b = browserify({
    entries: options.paths.src.js + 'app.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(gulpif(options.production, uglify()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(options.paths.dist.js));
});

gulp.task('js:async', function () {
    return gulp.src(options.paths.src.js + 'async/**/*')
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(options.paths.dist.js + 'async/'));
});

gulp.task('js', ['js:browserify', 'js:async']);

/* Build the flat html */
gulp.task('html', function(){
    return gulp.src(options.paths.src.html + 'views/**/*.html')
        .pipe(plumber({errorHandler: onError}))
        .pipe(frontMatter({ property: 'data' }))
        .pipe(data(function(file) {
            return {'assetPath': options.paths.deploy};
        }))
        .pipe(swig({
            defaults: {
                cache: false
            }
        }))
      .pipe(gulp.dest(options.paths.dist.html));
});

/* 
 * SASS > CSS
 * Build CSS from scss, prefix and add px values from rem
 *
 */
gulp.task('sass', function () {
    return gulp.src([options.paths.src.css + '**/*.scss', '!' + options.paths.src.css + '{fonts,kss}/*.*'])
    .pipe(plumber({errorHandler: onError}))
    .pipe(gulpif(!options.production, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer(options.config.autoprefixer))
    .pipe(pixrem())
    .pipe(minifyCss())    
    .pipe(header(banner, {pkg : pkg}))
    .pipe(gulpif(!options.production, sourcemaps.write()))
    .pipe(gulp.dest(options.paths.dist.css));
});

gulp.task('css', ['sass']);

/* Optimize images */
gulp.task('img', function () {
    return gulp.src([options.paths.src.img + '**/*'])
        .pipe(imagemin({
          progressive: true,
          interlaced: true,
          svgoPlugins: [{removeViewBox: true}]
        }))
        .pipe(gulp.dest(options.paths.dist.img));
});

/* Fonts */
gulp.task('fonts', function() {
    return gulp.src(options.paths.src.fonts + '**/*.*')
        .pipe(gulp.dest(options.paths.dist.fonts));
});

/* Compress CSS */
gulp.task('compress:css', function() {
});

/* Server with auto reload and browersync */
gulp.task('serve', ['build'], function () {
      browserSync({
        notify: false,
        // https: true,
        server: [options.paths.dist.base],
        tunnel: false
      });

      gulp.watch([options.paths.src.html + '**/*.html'], ['html', reload]);
      gulp.watch([options.paths.src.css + '**/*.scss'], ['css', reload]);
      gulp.watch([options.paths.src.img + '*'], ['img', reload]);
      gulp.watch([options.paths.src.js + '**/*'], ['js', reload]);
});

/* Watch */
gulp.task('watch', function () {
      gulp.watch([options.paths.src.html + '**/*.html'], ['html']);
      gulp.watch([options.paths.src.css + '**/*.scss'], ['css']);
      gulp.watch([options.paths.src.img + '**/*'], ['img']);
      gulp.watch([options.paths.src.js + '**/*'], ['js']);
});

/* Page speed insights */
gulp.task('psi', function(cb) {
  pagespeed.output(publicUrl, {
    strategy: psiStrategy,
  }, cb);
});


/************************
 *  Task API
 ************************/
/* Start task */
gulp.task('start', ['html', 'css', 'js', 'img', 'fonts', 'serve']);

/* The compress task */
gulp.task('compress', ['compress:css']);

/* Final build task including compression */
gulp.task('build', ['html', 'css', 'js', 'img', 'fonts']);

gulp.task('ci', runSequence('clean', 'build', 'compress'));

/* Default 'refresh' task */
gulp.task('default', ['start']);
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
    data = require('gulp-data'),
    extname = require('gulp-extname'),
    sourcemaps = require('gulp-sourcemaps'),
    path = require('path'),
    browserify = require('browserify'),
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
    gutil = require('gulp-util'),
    jshintConfig = pkg.jshintConfig;

var pagespeed = require('psi'),
    watchify = require('watchify'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    swig = require('gulp-swig'),
    frontMatter = require('gulp-front-matter');    

// = Options
//-----------------------------------------------------------------------------//

var options = { paths: { }, production: false };
nconf
    .argv()
    .env(['CI', 'APPVEYOR_BUILD_VERSION'])
    .file({ file: 'gulpfile.config.json' });
var options = nconf.get();

gutil.log(options);

/* Set up the banner */
var banner = [
    '/**',
    ' * @name ' + (pkg.name || "") + ': ' + (pkg.description || ""),
    ' * @version ' + (options.APPVEYOR_BUILD_VERSION || '') + ': ' + new Date().toUTCString(),
    ' * @author ' + (pkg.author || 'Storm ID'),
    ' * @license ' + (pkg.license || 'Storm ID'),
    ' */',
    ' '
].join('\n');

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

gulp.task('deploy:clean', function() {
    return del(options.paths.deploy, { force: true });
});

gulp.task('deploy:copy', function() {
    return gulp
        .src(options.paths.dist.base +"**/*")
        .pipe(gulp.dest(options.paths.deploy));
});

gulp.task('deploy', function() {
    return runSequence('deploy:clean', 'deploy:copy');
});

/* *** Development tasks *** */

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

/* Set the PSI variables */
// var publicUrl = '', //publicly accessible URL on your local machine, demo, staging, live...
//     psiStrategy = 'mobile'; //'mobile' or 'desktop'

/* Page speed insights */
gulp.task('psi', function(cb) {
    return pagespeed.output(options.config.psi, cb);
});


gulp.task('build', ['css', 'js', 'img', 'fonts']);

gulp.task('ci', runSequence('clean', 'build', 'deploy'));

gulp.task('start', ['html', 'css', 'js', 'img', 'fonts', 'serve']);

gulp.task('default', ['start']);

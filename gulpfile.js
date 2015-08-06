var gulp             = require('gulp');
var source           = require('vinyl-source-stream');
var browserify       = require('browserify');
var watchify         = require('watchify');
var reactify         = require('reactify');
var gulpif           = require('gulp-if');
var babelify         = require("babelify");
var uglify           = require('gulp-uglify');
var streamify        = require('gulp-streamify');
var notify           = require('gulp-notify');
var concat           = require('gulp-concat');
var cssmin           = require('gulp-cssmin');
var gutil            = require('gulp-util');
var shell            = require('gulp-shell');
var glob             = require('glob');
var jasminePhantomJs = require('gulp-jasmine2-phantomjs');
var express          = require('gulp-express'); // run express.js from gulp tasks
var newer            = require('gulp-newer');   // determines which files are newer in one dir compared to another dir
var debug            = require('gulp-debug');   // debug log messages in gulp pipelines
var clean            = require('gulp-clean');   // clean tasks
var env              = require('gulp-env');     // allows to set environment variables from gulp tasks

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
	/*'react',
  'react/addons'*/
];

var browserifyTask = function (options) {

  // Our app bundler
	var appBundler = browserify({
		entries: [options.src], // Only need initial file, browserify finds the rest
   	transform: [babelify], // We want to convert JSX to ES6 and ES6 to normal JavaScript
		debug: options.development, // Gives us sourcemapping
		cache: {}, packageCache: {}, fullPaths: options.development // Requirement of watchify
	});

	// We set our dependencies as externals on our app bundler when developing
	(options.development ? dependencies : []).forEach(function (dep) {
		appBundler.external(dep);
	});

  // The rebundle process
  var rebundle = function () {
    var start = Date.now();
    gutil.log('Building APP bundle');
    appBundler
      .bundle()
      .on('error', function(err) {
        gutil.log(gutil.colors.red(err.toString()));
      })
      .pipe(source('App.js'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        gutil.log('APP bundle built in ' + (Date.now() - start) + 'ms');
      }));
  };

  // Fire up Watchify when developing
  if (options.development) {
    appBundler = watchify(appBundler);
    appBundler.on('update', rebundle);
  }

  rebundle();
}

var cssTask = function (options) {
  if (options.development) {
    var run = function () {
      gutil.log(arguments);
      var start = new Date();
      gutil.log('Building CSS bundle');
      gulp.src(options.src)
        .pipe(concat('main.css'))
        .pipe(gulp.dest(options.dest))
        .pipe(notify(function () {
          gutil.log('CSS bundle built in ' + (Date.now() - start) + 'ms');
        }));
    };
    run();
    gulp.watch(options.src, run);
  } else {
    gulp.src(options.src)
      .pipe(concat('main.css'))
      .pipe(cssmin())
      .pipe(gulp.dest(options.dest));
  }
}

var staticTask = function(options) {
  var start = new Date();
  return gulp.src(options.src)
      .pipe(newer(options.dest))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function(file) {
				gutil.log('Copied', file.relative);
      }));
}

gulp.task('static', function() {
  staticTask({
    src: './static/**',
    dest: './public'
  });
});

var serverTask = function() {
	// Start the server at the beginning of the task
	express.run(['server.js']);
	// Restart the server when file changes
	gulp.watch(['./*.js'], express.notify);
	gulp.watch(['./routes/**'], express.notify);
	gulp.watch(['./models/**'], express.notify);
	gulp.watch(['./config/**'], express.notify);
}

gulp.task('browserify', function() {
	console.log(process.env.DEVELOPMENT);
	browserifyTask({
    development: process.env.DEVELOPMENT == "true",
    src: './views/jsx/App.jsx',
    dest: './public/js'
  });
});

gulp.task('set-env-dev', function () {
	console.log('set-env-dev');
  env({
    vars: {
      //DEBUG: "express:*",
			DEVELOPMENT : "true"
    }
  })
});

gulp.task('set-env-prod', function () {
	console.log('set-env-prod');
});

gulp.task('server', ['static', 'browserify'], function () {
  serverTask();
});

gulp.task('static', function() {
	staticTask({
    src: './static/**',
    dest: './public'
  });
	gulp.watch('./static/**', ['static']);
});

gulp.task('default', ['set-env-dev',  'browserify', 'static', 'server']);
gulp.task('deploy',  ['set-env-prod', 'browserify', 'static', 'server']);

gulp.task('test', function () {
  return gulp.src('./build/testrunner-phantomjs.html').pipe(jasminePhantomJs());
});

gulp.task('clean', function () {
  return gulp
		.src('public', {read: false})
    .pipe(clean());
});

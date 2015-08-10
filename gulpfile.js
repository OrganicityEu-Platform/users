var gulp             = require('gulp');
var source           = require('vinyl-source-stream');
var browserify       = require('browserify');
var watchify         = require('watchify');
var sequence         = require('run-sequence');
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
var marked           = require('gulp-marked');  // used for generating API documentation from markdown files
var open             = require('gulp-open');    // can open applications and URLs in the host OS default application

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
    gutil.log('Rebundling front end');
    appBundler
      .bundle()
      .on('error', function(err) {
        gutil.log(gutil.colors.red(err.toString()));
      })
      .pipe(source('App.js'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        gutil.log('Front end rebundled in ' + (Date.now() - start) + 'ms');
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

var server = {
	instance : null,
	start : function() {
		gutil.log('Starting server');
		server.instance = express.run(['server.js'], {}, false);
	},
	stop : function() {
		if (server.instance) {
			gutil.log('Stopping server');
			server.instance.stop();
		}
	},
	restart : function() {
		gutil.log('Restarting server');
		if (server.instance) {
			server.instance.stop();
		}
		server.instance = express.run(['server.js'], {}, false);
	}
}

gulp.task('browserify', function() {
	browserifyTask({
    development: process.env.DEVELOPMENT == "true",
    src: './views/jsx/App.jsx',
    dest: './public/js'
  });
});

var watches = {
	'api'    : ['./API.md'],
	'static' : ['./static/**'],
	'server' : ['./config/**','./models/**','./routes/**','./server.js','./api_routes.js','./ui_routes.js','./routes.js']
}

gulp.task('set-env-dev', function () {
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

gulp.task('server', function () {
  server.start();
});

gulp.task('static', function() {
	var src = './static/**';
	var dst = './public';
	return gulp.src(src)
      .pipe(newer(dst))
      .pipe(gulp.dest(dst))
      .pipe(notify(function(file) {
				gutil.log('Copied', file.relative);
      }));
});

gulp.task('default', function(callback) {
	sequence('set-env-dev', ['browserify', 'static'], 'server', callback);
	gulp.watch(watches.static, ['static']);
	gulp.watch(watches.server, server.restart);
});

gulp.task('build', function(callback) {
	sequence(['clean', 'set-env-prod'], ['browserify', 'static'], callback);
});

gulp.task('clean', function () {
  return gulp.src('public', {read: false}).pipe(clean());
});

var api = {
	build : function() {
		gutil.log('Rebuild API.md');
		gulp.src('./API.md')
	    .pipe(marked())
	    .pipe(gulp.dest('./tmp/'));
	},
	buildAndOpen : function() {
		gutil.log('Building API.md');
		gulp.src('./API.md')
	    .pipe(marked())
	    .pipe(gulp.dest('./tmp/'))
			.pipe(open());
	}
}

gulp.task('api', function() {
	api.buildAndOpen();
	gulp.watch(watches.api, api.build);
});

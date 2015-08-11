// READ this to (better) understand gulp and the plugin ecosystem: https://medium.com/@contrahacks/gulp-3828e8126466

var gulp               = require('gulp');
var path               = require('path');
var source             = require('vinyl-source-stream');
var browserify         = require('browserify');
var watchify           = require('watchify');
var sequence           = require('run-sequence');
var reactify           = require('reactify');
var gulpif             = require('gulp-if');
var babelify           = require('babelify');
var uglify             = require('gulp-uglify');
var streamify          = require('gulp-streamify');
var notify             = require('gulp-notify');
var concat             = require('gulp-concat');
var gutil              = require('gulp-util');
var shell              = require('gulp-shell');
var glob               = require('glob');
var express            = require('gulp-express'); 		// run express.js from gulp tasks
var newer              = require('gulp-newer');   		// determines which files are newer in one dir compared to another dir
var debug              = require('gulp-debug');   		// debug log messages in gulp pipelines
var clean              = require('gulp-clean');   		// clean tasks
var env                = require('gulp-env');     		// allows to set environment variables from gulp tasks
var markdownpdf        = require('gulp-markdown-pdf'); 	// Converts
var marked             = require('gulp-marked');  		// used for generating API documentation from markdown files
var open               = require('gulp-open');    		// can open applications and URLs in the host OS default application
var jscs               = require('gulp-jscs');    		// JavaScript code style with jscs
var eslint             = require('gulp-eslint');  		// Plugin for processing files with eslint
var cache              = require('gulp-cached');
var less               = require('gulp-less');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var sourcemaps         = require('gulp-sourcemaps');
var minifyCSS          = require('gulp-minify-css');
var livereload         = require('gulp-livereload');
var jasmine            = require('gulp-jasmine');
var jasmineReporters   = require('jasmine-reporters');

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
	/*'react',
  'react/addons'*/
];

var browserifyTask = function(options) {

  // Our app bundler
  var appBundler = browserify({
    entries: [options.src], // Only need initial file, browserify finds the rest
    transform: [babelify], // We want to convert JSX to ES6 and ES6 to normal JavaScript
    debug: options.development, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: options.development // Requirement of watchify
  });

  // We set our dependencies as externals on our app bundler when developing
  (options.development ? dependencies : []).forEach(function(dep) {
    appBundler.external(dep);
  });

  // The rebundle process
  var rebundle = function() {
    var start = Date.now();
    gutil.log('Rebundling front end');
    return appBundler
      .bundle()
      .on('error', function(err) {
        gutil.log(gutil.colors.red(err.toString()));
      })
      .pipe(source('App.js'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(livereload())
      .pipe(notify(function() {
        gutil.log('Front end rebundled in ' + (Date.now() - start) + 'ms');
      }));
  };

  // Fire up Watchify when developing
  if (options.development) {
    appBundler = watchify(appBundler);
    appBundler.on('update', rebundle);
  }

  return rebundle();
};

var server = {
  instance : null,
  start : function(callback) {
    gutil.log('Starting server');
    server.instance = express.run(['server.js'], {}, false);
    callback();
  },
  restart : function(callback) {
    gutil.log('Restarting server');
    if (server.instance) {
      server.instance.stop();
    }
    server.instance = express.run(['server.js'], {}, false);
    livereload.reload();
    callback();
  }
};

gulp.task('browserify', ['lint', 'test'], function() {
  return browserifyTask({
    development: process.env.DEVELOPMENT === 'true',
    src: './views/jsx/App.jsx',
    dest: './public/js'
  });
});

var watches = {
  'api'    : ['./API.md'],
  'less'   : ['./assets/less/**/*.less'],
  'static' : ['./static/**'],
  'server' : [
    './config/**',
    './models/**',
    './routes/**',
    './server.js',
    './api_routes.js',
    './ui_routes.js',
    './routes.js',
  ],
  'jscs' : [
    '*.js',
    './config/**',
    './models/**',
    './routes/**',
    './script/**',
    './utils/**',
    './views/**'
  ],
  'eslint' : [
    '*.js',
    './config/**',
    './models/**',
    './routes/**',
    './script/**',
    './utils/**',
    './views/**'
  ],
  'md' : [
    'README.md'
  ],
  'test' : 'test/*.spec.js'
};

gulp.task('set-env-dev', function() {
  env({
    vars: {
      //DEBUG: "express:*",
      DEVELOPMENT : 'true'
    }
  });
});

gulp.task('set-env-prod', function() {
  console.log('set-env-prod');
});

gulp.task('server', function(callback) {
  if (server.instance) {
    server.restart(callback);
  } else {
    server.start(callback);
  }
});

gulp.task('static', ['lint', 'test'], function() {
  var src = './static/**';
  var dst = './public';
  return gulp.src(src)
    .pipe(newer(dst))
    .pipe(cache('static'))
    .pipe(gulp.dest(dst))
    .pipe(livereload())
    .pipe(notify(function(file) {
      gutil.log('Copied', file.relative);
    }));
});

gulp.task('jscs', function() {
  return gulp.src(watches.jscs)
    .pipe(cache('jscs'))
    .pipe(jscs())
    .on('error', function(err) {
      gutil.log(err);
    });
});

gulp.task('eslint', ['jscs'], function() {
  return gulp.src(watches.eslint)
    .pipe(cache('eslint'))
    .pipe(eslint({
      baseConfig: {
        parser: 'babel-eslint'
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('lint', ['jscs', 'eslint']);

gulp.task('less', ['lint'], function() {
  var cleancss = new LessPluginCleanCSS({ advanced: true });
  if (process.env.DEVELOPMENT) {
    return gulp.src('./assets/less/**/*.less')
      .pipe(cache('less'))
      .pipe(sourcemaps.init())
      .pipe(less({
        paths: [path.join(__dirname, 'node_modules/bootstrap/less')],
        plugins: [cleancss]
      }))
      .on('error', function(err) {
        gutil.log(gutil.colors.red(err.toString()));
      })
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./public/css'))
      .pipe(livereload());
  }
  return gulp.src('./assets/less/**/*.less')
    .pipe(less({ plugins: [cleancss] }))
    .on('error', function(err) {
      gutil.log(gutil.colors.red(err));
    })
    .pipe(minifyCSS())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('default', function(callback) {
  sequence('set-env-dev', 'lint', 'test', ['browserify', 'static', 'less'], 'server', function(err) {
    if (err) {
      return callback(err);
    }
    livereload.listen();
    gulp.watch(watches.less,   ['less']);
    gulp.watch(watches.static, ['static']);
    gulp.watch(watches.server, ['server']);
    gulp.watch(watches.test,   ['test']);
  });
});

gulp.task('build', function(callback) {
  return sequence(['clean', 'set-env-prod'], ['lint', 'test'], ['less', 'browserify', 'static'], callback);
});

gulp.task('clean', function() {
  return gulp.src('public', {read: false}).pipe(clean());
});

var api = {
  build : function() {
    gutil.log('Rebuild API.md');
    return gulp.src('./API.md')
      .pipe(marked())
      .pipe(gulp.dest('./tmp/'));
  },
  buildAndOpen : function() {
    gutil.log('Building API.md');
    return gulp.src('./API.md')
      .pipe(marked())
      .pipe(gulp.dest('./tmp/'))
      .pipe(open());
  }
};

gulp.task('api', function() {
  gulp.watch(watches.api, api.build);
  return api.buildAndOpen();
});

gulp.task('pdf', function() {
  return gulp.src(watches.md)
    .pipe(cache('pdf'))
    .pipe(markdownpdf())
    .pipe(gulp.dest('doc'))
    .on('error', function(err) {
      gutil.log(err);
    });
});

gulp.task('test', function() {
  // TODO use jest for (React) unit testing!?
  // https://facebook.github.io/jest/
  return gulp.src('test/*.spec.js')
    .pipe(jasmine({
      verbose: true,
      includeStackTrace: true,
      reporter: new jasmineReporters.TerminalReporter({
        isVerbose : true,
        includeStackTrace : true,
        showColors : true
      })
    }));
});

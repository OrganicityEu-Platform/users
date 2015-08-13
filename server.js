// lib dependencies ===========================================================
var express           = require('express');
var mongoose          = require('mongoose');
var passport          = require('passport');
var flash             = require('connect-flash');
var morgan            = require('morgan');
var cookieParser      = require('cookie-parser');
var bodyParser        = require('body-parser');
var session           = require('express-session');
var expressListRoutes = require('express-list-routes');
var timers            = require('timers');

// configuration ==============================================================
var app               = express();
var router            = express.Router();
var config            = require('./config/config.js');
var configDB          = require('./config/database.js');
var port              = process.env.PORT || config.port;
var ui                = require('./ui_routes.js');

mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.use(ui.asset('/static'), express.static('public'));

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

// required for passport
app.use(session({ secret: 'organicityScenarioTool' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes =====================================================================

// simulates network latency in development mode
if (app.get('env') === 'development') {
  app.use(function(req, res, next) {
    timers.setTimeout(function() {
      next();
    }, 500);
  });
}

var routes_scenarios = require('./routes/api/v1/api.js')(router, passport);
var routes_auth      = require('./routes/api/v1/auth.js')(router, passport);
var routes_users     = require('./routes/api/v1/users.js')(router, passport);
var routes_error     = require('./routes/api/v1/error.js')(router, passport);
var routes_sysinfo   = require('./routes/api/v1/sysinfo.js')(router, passport);

app.use(routes_scenarios);
app.use(routes_auth);
app.use(routes_users);
app.use(routes_error);

// serve all (other) requests to single-page-app contained in index.html
var index = require('./index.js');
var contextPath = config.contextPath;
contextPath = contextPath.substr(0, 1) === '/' ? contextPath : '/' + contextPath;
contextPath = contextPath.substr(contextPath.length - 1) === '/' ? contextPath + '?' : contextPath + '/?';
var catchAllRoute = contextPath + '*';
app.get(catchAllRoute, function(req, res) {
  res.status(200).send(index);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
  console.log('404 ', req.path);
});

// error handlers
if (app.get('env') === 'development') {

  console.log('Starting server in development mode');

  // development error handler
  // will print stacktrace
  app.use(function(err, req, res, next) {
    if (!err.status || err.status === 500) {
      console.log(err.stack);
    }
    res.status(err.status || 500);
    res.format({
      'application/json': function() {
        res.json(err);
      },
      'default': function() {
        res.status(406).send('Not Acceptable');
      }
    });
  });

} else {

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.format({
        'application/json': function() {
          res.json({});
        },
        'default': function() {
          res.send(406, 'Not Acceptable');
        }
      });
  });
}

// launch =====================================================================
app.listen(port);
expressListRoutes({ prefix: '' }, 'Server REST API:', router);
console.log('Server started on ' + config.host + ':' + port + config.contextPath);

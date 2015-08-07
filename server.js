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

// configuration ==============================================================
var app               = express();
var router            = express.Router();
var config            = require('./config/config.js');
var configDB          = require('./config/database.js');
var port              = process.env.PORT || config.port;

mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.use('/static', express.static('public'));

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

var api_config  = require('./routes/api/config.js');
var api_version = api_config.version;

var routes_scenarios = require('./routes/api/' + api_version + '/api.js')(router, passport);
var routes_auth      = require('./routes/api/' + api_version + '/auth.js')(router, passport);
var routes_users     = require('./routes/api/' + api_version + '/users.js')(router, passport);

app.use(routes_scenarios);
app.use(routes_auth);
app.use(routes_users);

if (app.get('env') === 'development') {
  app.use(require('./routes/api/' + api_version + '/error.js')(router, passport));
}

// serve all (other) requests to single-page-app contained in index.html
app.get('/*', function (req, res) {
  var options = {
    root: __dirname + '/public/',
    dotfiles: 'deny'
  };
  res.sendFile('index.html', options);
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
    if (!err.status || err.status == 500) {
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
expressListRoutes({ prefix: '' }, 'Server REST API:', router );
console.log('Server started on port ' + port);

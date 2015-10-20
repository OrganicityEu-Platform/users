/*
 * Checks, if a user is logged in
 */
var config     = require('../config/config.js');
var HttpStatus = require('http-status');

module.exports = function(passport) {
  return function(req, res, next) {

    //console.log('isLoggedIn()');

    // Check, if logged in via non HTTP Basic auth
    if (typeof req.isAuthenticated === 'function' && req.isAuthenticated()) {
      //console.log('isLoggedIn(): is authenticated!');
      return next();
    }

    // Check for HTTP Basic auth
    passport.authenticate('basic', { session: false }, function(err, user, info) {

      if (err) {
        return next(err);
      }
      if (!user) {
        //console.log('isLoggedIn(): unauthorized');
        res.format({
          'application/json': function() {
            return res.status(HttpStatus.UNAUTHORIZED).json({});
          },
          'text/html': function() {
            return res.status(HttpStatus.UNAUTHORIZED).send('401 Unauthorized');
          },
          'default': function() {
            return res.status(HttpStatus.NOT_ACCEPTABLE).send('406 Not Acceptable');
          }
        });
      } else {
        //console.log('isLoggedIn(): with basic auth');
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          //console.log('isLoggedIn(): with basic auth: succeeded!');
          return next();
        });
      }
    })(req, res, next);
  };
};

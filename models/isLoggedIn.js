/*
 * Checks, if a user is logged in
 */

module.exports = function(passport) {
  return function (req, res, next) {

    // Check, if logged in via non HTTP Basic auth
    if (req.isAuthenticated()) {
      return next();
    }

    // Check for HTTP Basic auth
    passport.authenticate('basic', { session: false }, function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.format({
          'text/html': function() {
            return res.redirect('/login');
          },
          'application/json': function() {
            return res.status(401).send("401 Unauthorized");
          },
          'default': function() {
            return res.status(406).send("406 Not Acceptable");
          }
        });
      } else {
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          return next();
        });
      }
    })(req, res, next);
  }
}

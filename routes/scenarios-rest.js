module.exports = function(passport) {

    var express = require('express');
    var router = express.Router();

    //###############################################################
    // ROUTES
    //###############################################################

    // route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {

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

            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return next();
            });

        })(req, res, next);
    }

    return router;
}


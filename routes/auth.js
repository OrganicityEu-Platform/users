module.exports = function(app, passport) {

    var express = require('express');
    var router = express.Router();

// normal routes ===============================================================

    router.get('/currentUser', function(req, res) {
        if (req.user) {
          res.json({
            uuid : req.user.uuid,
            name : req.user.name,
            roles : req.user.roles
          });
        } else {
          res.status(404).send("NOT FOUND");
        }
    });

    // show the home page (will also have our login links)
    router.get('/login', function(req, res) {
        res.render('auth/login.ejs', { req_user : undefined });
    });

    // PROFILE SECTION =========================
    router.get('/profile', [isLoggedIn], function(req, res) {
        res.render('auth/profile.ejs', {
            user : req.user,
			      req_user : req.user
        });
    });

    // LOGOUT ==============================
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        router.get('/local-login', function(req, res) {
            res.render('auth/local-login.ejs', { req_user : undefined, message: req.flash('loginMessage') });
        });

        // process the login form
        router.post('/local-login', passport.authenticate('local-login', {
            successRedirect : '/auth/profile', // redirect to the secure profile section
            failureRedirect : '/auth/local-login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        router.get('/signup', function(req, res) {
            res.render('auth/signup.ejs', { req_user : undefined, message: req.flash('signupMessage') });
        });

        // process the signup form
        router.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/auth/profile', // redirect to the secure profile section
            failureRedirect : '/auth/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        router.get('/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        router.get('/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/auth/profile',
                failureRedirect : '/auth/login'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        router.get('/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        router.get('/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/auth/profile',
                failureRedirect : '/auth/login'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        router.get('/google/callback',
            passport.authenticate('google', {
                successRedirect : '/auth/profile',
                failureRedirect : '/auth/login'
            }));

    // github ---------------------------------

        // send to google to do the authentication
        router.get('/github', passport.authenticate('github', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        router.get('/github/callback',
            passport.authenticate('github', {
                successRedirect : '/auth/profile',
                failureRedirect : '/auth/login'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        router.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        router.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/auth/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        router.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        router.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/auth/profile',
                failureRedirect : '/auth/login'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        router.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        router.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/auth/profile',
                failureRedirect : '/auth/login'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        router.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        router.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/auth/profile',
                failureRedirect : '/auth/login'
            }));


    // github ---------------------------------

        // send to google to do the authentication
        router.get('/connect/github', passport.authorize('github', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        router.get('/connect/github/callback',
            passport.authorize('github', {
                successRedirect : '/auth/profile',
                failureRedirect : '/auth/login'
            }));

	  // TODO: Load via require
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
                return res.redirect('/auth/login');
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
};

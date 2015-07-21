module.exports = function(app, passport) {

    var express = require('express');
    var router = express.Router();

// normal routes ===============================================================

    // show the home page (will also have our login links)
    router.get('/login', function(req, res) {
        res.render('login.ejs', { req_user : undefined });
    });

    // PROFILE SECTION =========================
    router.get('/profile', [isLoggedIn], function(req, res) {
        res.render('profile.ejs', {
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
            res.render('local-login.ejs', { req_user : undefined, message: req.flash('loginMessage') });
        });

        // process the login form
        router.post('/local-login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/local-login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        router.get('/signup', function(req, res) {
            res.render('signup.ejs', { req_user : undefined, message: req.flash('signupMessage') });
        });

        // process the signup form
        router.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        router.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/login'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        router.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        router.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/login'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        router.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/login'
            }));

    // github ---------------------------------

        // send to google to do the authentication
        router.get('/auth/github', passport.authenticate('github', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        router.get('/auth/github/callback',
            passport.authenticate('github', {
                successRedirect : '/profile',
                failureRedirect : '/login'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        router.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        router.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        router.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        router.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/login'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        router.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        router.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/login'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        router.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        router.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/login'
            }));


    // github ---------------------------------

        // send to google to do the authentication
        router.get('/connect/github', passport.authorize('github', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        router.get('/connect/github/callback',
            passport.authorize('github', {
                successRedirect : '/profile',
                failureRedirect : '/login'
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
                return res.redirect('/login');
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

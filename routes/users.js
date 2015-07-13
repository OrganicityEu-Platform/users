module.exports = function(passport) {

    var express = require('express');
    var router = express.Router();

    var User = require('../models/user.js');

    router.get('/', [isLoggedIn], function(req, res) {

        User.find(function (err, users) {
            if (err) {
                return next(err);
            } else {
                res.render('users/users.ejs', {
                    user : req.user,
                    users : users
                });
            }
        });
    });

    router.get('/:id', [isLoggedIn], function(req, res) {

        User.findOne({ 'profile.uuid' :  req.params.id }, function(err, user) {

            if(user == null) {
                res.status(404);
            }

            if (err) {
                console.log(err);
                return next(err);
            } else {
                res.render('users/users.ejs', {
                    user : req.user,
                    users : [user]
                });
            }
        });
    });

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


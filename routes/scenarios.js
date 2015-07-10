module.exports = function(passport) {

    var express = require('express');
    var router = express.Router();

    var Scenario = require('../models/Scenario.js');

    // show the home page (will also have our login links)
    router.get('/', function(req, res) {

        Scenario.find(function (err, scenarios) {
            if (err) {
                return next(err);
            } else {
                res.render('scenarios/scenarios.ejs', {
                    user : req.user,
                    scenarios : scenarios
                });
            }
        });
    });

    // show the home page (will also have our login links)
    router.get('/create', [isLoggedIn], function(req, res) {
        res.render('scenarios/scenarios-form.ejs', {
            user : req.user,
            id : undefined
        });
    });

    // show the home page (will also have our login links)
    router.get('/:id', function(req, res) {
        Scenario.findById(req.params.id, function (err, scenario) {

            if(scenario == null) {
                res.status(404);
            }

            if (err) {
                return next(err);
            } else {
                res.render('scenarios/scenarios.ejs', {
                    user : req.user,
                    id : req.params.id,
                    scenarios : [scenario]
                });
            }
        });
    });

    // show the home page (will also have our login links)
    router.get('/:id/edit', [isLoggedIn], function(req, res) {
        res.render('scenarios/scenarios-form.ejs', {
            user : req.user,
            id : req.params.id
        });
    });

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


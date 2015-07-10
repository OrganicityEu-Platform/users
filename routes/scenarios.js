module.exports = function(passport) {

    var express = require('express');
    var router = express.Router();

    var validate = require('isvalid').validate;

    var mongoose = require('mongoose');

    var Scenario = require('../models/Scenario.js');

    var ScenarioSchema = {
        'title': { type: String },
        'text': { type: String }
    }

    var ScenarioSchemaPost = {
        type : Object,
        unknownKeys: 'remove',
        schema : {
            'title': { type: String, required: true },
            'text': { type: String, required: true }            
        }
    }

    var ScenarioSchemaPatch = {                    
        type : Object,
        unknownKeys: 'remove',
        schema : {
            'title': { type: String, required: false },
            'text': { type: String, required: false }            
        }
    }
    // GET /scenarios
    router.get('/', [isLoggedIn], function(req, res, next) {
        Scenario.find(function (err, todos) {
            if (err) {
                return next(err);
            } else {
                res.json(todos);
            }
        });
    });

    // POST /scenarios
    //      http://localhost:3000/scenarios 
    //      {"title":"A2","text":"B2" }
    router.post('/', [isLoggedIn, validate.body(ScenarioSchemaPost)], function(req, res, next) {

        console.log("Body:", req.body);

        Scenario.create(req.body, function (err, post) {
            if (err) {
                return next(err);
            } else {
                res.json(post);
            }
        });
    });

    // GET /scenarios/id
    router.get('/:id', [isLoggedIn], function(req, res, next) {
        Scenario.findById(req.params.id, function (err, post) {

            if(post == null) {
                res.status(404);
            }

            if (err) {
                return next(err);
            } else {
                res.json(post);
            }
        });
    });

    // PUT /scenarios/:id
    //router.put('/:id', function(req, res, next) {
    router.put('/:id', [isLoggedIn, validate.body(ScenarioSchemaPost)], function(req, res, next) {

        console.log("Body:", req.body);

        // Add updated_at
        req.body.updated_at = Date.now();

        Scenario.findByIdAndUpdate(req.params.id, req.body, function (err, post) {

            if(post == null) {
                res.status(404);
            }

            if (err) {
                return next(err);
            } else {
                res.json(post);
            }
        });
    });

    // PATCH /scenarios/:id
    router.patch('/:id', [isLoggedIn], function(req, res, next) {

        req.body.updated_at = Date.now();

        Scenario.findByIdAndUpdate(req.params.id, req.body, function (err, post) {

            if(post == null) {
                res.status(404);
            }

            if (err) {
                return next(err);
            } else {
                res.json(post);
            }
        });

    });

    // DELETE /todos/:id
    router.delete('/:id', [isLoggedIn], function(req, res, next) {
        Scenario.findByIdAndRemove(req.params.id, req.body, function (err, post) {
            if (err) {
                return next(err);
            } else {
                res.json(post);
            }
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
                return res.status(401).send("401 Unauthorized");
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


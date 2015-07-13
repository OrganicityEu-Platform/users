module.exports = function(passport) {

    var express = require('express');
    var router = express.Router();
    var isLoggedIn = require('../config/isLoggedIn.js')(passport);

    //###############################################################
    // is valid schemas
    //###############################################################

    var validate = require('isvalid').validate;

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

    //###############################################################
    // Routes
    //###############################################################

    var Scenario = require('../models/Scenario.js');

    // GET /scenarios
    router.get('/', function(req, res) {

        Scenario.find(function (err, scenarios) {
            if (err) {
                return next(err);
            } else {
                res.format({
                    'text/html': function() {
                        res.render('scenarios/scenarios.ejs', {
                            user : req.user,
                            scenarios : scenarios
                        });
                    },
                    'application/json': function() {
                        res.json(scenarios);
                    },
                    'default': function() {
                        res.send(406, 'Not Acceptable');
                    }
                });
            }
        });
    });

    // POST /scenarios
    //      http://localhost:3000/scenarios 
    //      {"title":"A2","text":"B2" }
    router.post('/', [isLoggedIn, validate.body(ScenarioSchemaPost)], function(req, res, next) {

        Scenario.create(req.body, function (err, scenario) {
            if (err) {
                return next(err);
            } else {
                res.format({
                    'application/json': function() {
                        res.json(scenario);
                    },
                    'default': function() {
                        res.send(406, 'Not Acceptable');
                    }
                });
            }
        });
    });

    // GET /scenarios/create
    router.get('/create', [isLoggedIn], function(req, res) {

        res.format({
            'text/html': function() {
                res.render('scenarios/scenarios-form.ejs', {
                    user : req.user,
                    id : undefined
                });
            },
            'default': function() {
                res.send(406, 'Not Acceptable');
            }
        });
    });


    // GET /scenarios/id
    router.get('/:id', [], function(req, res, next) {
        Scenario.findById(req.params.id, function (err, scenario) {

            if(scenario == null) {
                res.status(404);
            }

            if (err) {
                return next(err);
            } else {
                res.format({
                    'text/html': function() {
                        res.render('scenarios/scenarios.ejs', {
                            user : req.user,
                            scenarios : [scenario]
                        });
                    },
                    'application/json': function() {
                        res.json(scenario);
                    },
                    'default': function() {
                        res.send(406, 'Not Acceptable');
                    }
                });
            }
        });
    });

    // PUT /scenarios/:id
    //router.put('/:id', function(req, res, next) {
    router.put('/:id', [isLoggedIn, validate.body(ScenarioSchemaPost)], function(req, res, next) {

        // Add updated_at
        req.body.updated_at = Date.now();

        Scenario.findByIdAndUpdate(req.params.id, req.body, function (err, scenario) {

            if(scenario == null) {
                res.status(404);
            }

            if (err) {
                return next(err);
            } else {
                res.format({
                    'application/json': function() {
                        res.json(scenario);
                    },
                    'default': function() {
                        res.send(406, 'Not Acceptable');
                    }
                });
            }
        });
    });

    // PATCH /scenarios/:id
    router.patch('/:id', [isLoggedIn], function(req, res, next) {

        req.body.updated_at = Date.now();

        Scenario.findByIdAndUpdate(req.params.id, req.body, function (err, scenario) {

            if(scenario == null) {
                res.status(404);
            }

            if (err) {
                return next(err);
            } else {
                res.format({
                    'application/json': function() {
                        res.json(scenario);
                    },
                    'default': function() {
                        res.send(406, 'Not Acceptable');
                    }
                });
            }
        });

    });

    // DELETE /scenarios/:id
    router.delete('/:id', [isLoggedIn], function(req, res, next) {

        Scenario.findByIdAndRemove(req.params.id, req.body, function (err, scenario) {
            if (err) {
                return next(err);
            } else {
                res.format({
                    'application/json': function() {
                        res.json(scenario);
                    },
                    'default': function() {
                        res.send(406, 'Not Acceptable');
                    }
                });
            }
        });
    });


    // GET /scenarios/:id
    router.get('/:id/edit', [isLoggedIn], function(req, res) {

        res.format({
            'text/html': function() {
                res.render('scenarios/scenarios-form.ejs', {
                    user : req.user,
                    id : req.params.id
                });
            },
            'default': function() {
                res.send(406, 'Not Acceptable');
            }
        });
    });

    return router;
};


module.exports = function(passport) {

    var express = require('express');
    var router = express.Router();

    var truncate = require('truncate');

    var isLoggedIn = require('../models/isLoggedIn.js')(passport);
    var hasRole = require('../models/hasRole.js');

    var Scenario = require('../models/scenarioSchema.js');

    //###############################################################
    // is valid schemas
    //###############################################################

    var validate = require('isvalid').validate;

    var searchSchema = {
        type : Object,
        unknownKeys: 'remove',
        schema : {
            'text': { type: String, required: true }
        }
    }

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

    // GET /scenarios
    router.get('/', function(req, res, next) {
        Scenario.find({}).sort({created_at: -1}).exec(function (err, scenarios) {
            if (err) {
                return next(err);
            } else {
        				scenarios.forEach(function(e) {
                    e.text = truncate(e.text, 100);
        				});
                res.format({
                    'text/html': function() {
                        res.render('scenarios/scenarios', {
                            req_user  : req.user,
                            scenarios : scenarios,
                            title     : "Browse Scenarios"
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

        req.body.owner = req.user.uuid;

        Scenario.create(req.body, function (err, scenario) {
            if (err) {
                return next(err);
            } else {
                res.format({
                    'application/json': function() {
                        res.status(201);
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
    router.get('/create', [isLoggedIn], function(req, res, next) {

        res.format({
            'text/html': function() {
                res.render('scenarios/scenarios-form', {
					req_user : req.user,
                    id : undefined
                });
            },
            'default': function() {
                res.send(406, 'Not Acceptable');
            }
        });
    });

    // GET /scenarios/my == SAME AS /users/:id/scenarios !!!
    router.get('/my', [isLoggedIn], function(req, res, next) {

		Scenario.find({ 'owner' : req.user.uuid }).sort({created_at: -1}).exec(function (err, scenarios) {
            if (err) {
                return next(err);
            } else {

				scenarios.forEach(function(e) {
					e.text = truncate(e.text, 100);
				});

                res.format({
                    'text/html': function() {
                        res.render('scenarios/scenarios', {
							title: "My Scenarios",
                            req_user : req.user,
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

    router.get('/search', function(req, res, next) {

        res.format({
            'text/html': function() {
                res.render('scenarios/search', {
                    req_user : req.user
                });
            },
            'default': function() {
                res.send(406, 'Not Acceptable');
            }
        });

	});

    // GET /scenarios/search
    router.post('/search', [validate.body(searchSchema)], function(req, res, next) {

		// https://github.com/freakycue/mongoose-search-plugin
		Scenario.search(req.body.text, {}, {
//			sort: {title: 1},
			limit: 25
		}, function(err, searchresult) {

            if (err) {
                return next(err);
            } else {

				searchresult.results.forEach(function(e) {
					e.text = truncate(e.text, 100);
				});

                res.format({
                    'text/html': function() {
                        res.render('scenarios/scenarios-list', {
							title: "Scenarios Search Result",
                            req_user : req.user,
							count : searchresult.totalCount,
                            scenarios : searchresult.results
                        });
                    },
                    'application/json': function() {
                        res.status(200);
                        res.json(searchresult);
                    },
                    'default': function() {
                        res.send(406, 'Not Acceptable');
                    }
                });
            }
		});
    });

    // GET /scenarios/id
    router.get('/:id', [], function(req, res, next) {
        Scenario.findById(req.params.id, function (err, scenario) {

            if(scenario == null) {
                var err = new Error("Scenario " + req.params.id + " not found");
                err.status = 404;
                return next(err);
            } else if (err) {
                return next(err);
            } else {
                res.format({
                    'text/html': function() {
                        res.render('scenarios/scenario', {
                            req_user : req.user,
                            scenario : scenario,
							title: "Scenario details"
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

    var putOrPatchScenario = function(req, res, next) {

        // Add updated_at
        req.body.updated_at = Date.now();

        Scenario.findByIdAndUpdate(req.params.id, req.body, function (err, scenario) {
            if(scenario == null) {
                var err = new Error("Scenario " + req.params.id + " not found");
                err.status = 404;
                return next(err);
            } else if (err) {
                return next(err);
			// FIXME: TO LATE !!!
            } else if(req.user.hasRole(["admin"]) || scenario.hasOwner(req.user)){
                res.format({
                    'application/json': function() {
                        res.json(scenario);
                    },
                    'default': function() {
                        res.send(406, 'Not Acceptable');
                    }
                });
            } else {
                var err = new Error("Forbidden: Not allowed to edit Scenario " + req.params.id);
                err.status = 403;
                return next(err);
            }
        });
    };

    // PUT /scenarios/:id
    router.put('/:id', [isLoggedIn, validate.body(ScenarioSchemaPost)], putOrPatchScenario);

    // PATCH /scenarios/:id
    router.patch('/:id', [isLoggedIn, hasRole(["user", "admin"])], putOrPatchScenario);

    // DELETE /scenarios/:id
    router.delete('/:id', [isLoggedIn, hasRole(["admin"])], function(req, res, next) {

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
    router.get('/:id/edit', [isLoggedIn], function(req, res, next) {

        Scenario.findById(req.params.id, function (err, scenario) {

            if(scenario == null) {
                var err = new Error("Scenario " + req.params.id + " not found");
                err.status = 404;
                return next(err);
            } else if (err) {
                return next(err);
            } else if(req.user.hasRole(["admin"]) || scenario.hasOwner(req.user)){
                res.format({
                    'text/html': function() {
                        res.render('scenarios/scenarios-form', {
                            req_user : req.user,
                            id : req.params.id
                        });
                    },
                    'default': function() {
                        res.send(406, 'Not Acceptable');
                    }
                });
            } else {
                var err = new Error("Forbidden: Not allowed to edit Scenario " + req.params.id);
                err.status = 403;
                return next(err);
            }
        });
    });

    return router;
};

module.exports = function(passport) {

  var express = require('express');
  var router = express.Router();

  var truncate = require('truncate');

  var isLoggedIn = require('../models/isLoggedIn.js')(passport);
  var hasRole = require('../models/hasRole.js');

  var User = require('../models/userSchema.js');
  var Scenario = require('../models/scenarioSchema.js');

	var isUserOrAdmin = function (req, res, next) {
		if(req.user.hasRole(["admin"])) {
      return next();
		} else if(req.user.uuid == req.params.id) {
      return next();
		} else {
			// Other users are not allowed to edit anything!
	    var err = new Error("Forbidden: Not allowed to edit User " + req.params.id);
	    err.status = 403;
	    return next(err);
		}
	}

   //###############################################################
    // is valid schemas
    //###############################################################

    var validate = require('isvalid').validate;

    var UserSchemaPost = {
        type : Object,
        unknownKeys: 'remove',
        schema : {
            'roles': {
                type: Array,
                required: true,
                schema: {
                    type: String
                }
            },
            'name': { type: String, required: true },
            'gender': { type: String, required: true },
        }
    }

    var UserSchemaPatch = {
        type : Object,
        unknownKeys: 'remove',
        schema : {
            'roles': {
                type: Array,
                required: false,
                schema: {
                    type: String
                }
            },
            'name': { type: String, required: false },
            'gender': { type: String, required: false },
			'local' : {
				type : Object,
				schema : {
					'email' : { type: String, required: false },
					'password' : { type: String, required: false }
				}
			}
        }
    }

    //###############################################################
    // Routes
    //###############################################################

    router.get('/', [isLoggedIn, hasRole(["admin"])], function(req, res, next) {

        User.find(function (err, users) {
            if (err) {
                return next(err);
            } else {
                res.format({
                    'text/html': function() {
                        res.render('users/users-list', {
                            req_user : req.user,
                            users : users
                        });
                    },
                    'application/json': function() {
                        res.json(users);
                    },
                    'default': function() {
                        res.send(406, 'Not Acceptable');
                    }
                });
            }
        });
    });

    router.get('/:id', function(req, res, next) {

        User.findOne({ 'uuid' :  req.params.id }, function(err, user) {

            if(user == null) {
			    var err = new Error("User " + req.params.id + " not found");
			    err.status = 404;
			    return next(err);
            }

            if (err) {
                console.log(err);
                return next(err);
            } else {

				Scenario.find({ 'owner' : user.uuid }).sort({created_at: -1}).exec(function (err, scenarios) {
				    if (err) {
				        return next(err);
				    } else {

						scenarios.forEach(function(e) {
							e.text = truncate(e.text, 100);
						});

						console.log(req.user);

				        res.format({
				            'text/html': function() {
				                res.render('users/user', {
				                    req_user : req.user,
				                    user : user,
									scenarios : scenarios
				                });
				            },
				            'application/json': function() {
				                res.json(user);
				            },
				            'default': function() {
				                res.send(406, 'Not Acceptable');
				            }
				        });
				    }
				});
            }
        });
    });

    // GET /users/:id
    router.get('/:id/edit', [isLoggedIn, hasRole(["admin"])], function(req, res, next) {

        User.findOne({ 'uuid' :  req.params.id }, function(err, user) {

			console.log(user);

			if(user == null) {
                res.status(404);
            }

            if (err) {
                console.log(err);
                return next(err);
            } else {
				res.format({
				    'text/html': function() {
						res.render('profile', {
							user : user,
							req_user : req.user
						});
				    },
				    'default': function() {
				        res.send(406, 'Not Acceptable');
				    }
				});
			}
		});
    });

    // GET /scenarios
    router.get('/:id/scenarios', function(req, res, next) {

        Scenario.find({ 'owner' : req.params.id }, function (err, scenarios) {
            if (err) {
                return next(err);
            } else {
                res.format({
                    'text/html': function() {
                        res.render('scenarios/scenarios', {
                            req_user : req.user,
                            scenarios : scenarios,
							title : "Scenarios for User" + req.params.id
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

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    router.get('/:id/unlink/local', [isLoggedIn, isUserOrAdmin], function(req, res) {

        User.findOne({ 'uuid' :  req.params.id }, function(err, user) {
            if (err) {
                return next(err);
            } else {
				user.local.email    = undefined;
				user.local.password = undefined;
				user.save(function(err) {
				    res.redirect(req.header("Referer"));
				});
			}
        });

    });

    // facebook -------------------------------
    router.get('/:id/unlink/facebook', [isLoggedIn, isUserOrAdmin], function(req, res) {
        User.findOne({ 'uuid' :  req.params.id }, function(err, user) {
            if (err) {
                return next(err);
            } else {
				user.facebook.token = undefined;
				user.save(function(err) {
				    res.redirect(req.header("Referer"));
				});
			}
        });
    });

    // twitter --------------------------------
    router.get('/:id/unlink/twitter', [isLoggedIn, isUserOrAdmin], function(req, res) {
        User.findOne({ 'uuid' :  req.params.id }, function(err, user) {
            if (err) {
                return next(err);
            } else {
				user.twitter.token = undefined;
				user.save(function(err) {
				    res.redirect(req.header("Referer"));
				});
			}
        });
    });

    // google ---------------------------------
    router.get('/:id/unlink/google', [isLoggedIn, isUserOrAdmin], function(req, res) {
        User.findOne({ 'uuid' :  req.params.id }, function(err, user) {
            if (err) {
                return next(err);
            } else {
				user.google.token = undefined;
				user.save(function(err) {
				    res.redirect(req.header("Referer"));
				});
			}
        });
    });

    // github ---------------------------------
    router.get('/:id/unlink/github', [isLoggedIn, isUserOrAdmin], function(req, res) {
        User.findOne({ 'uuid' :  req.params.id }, function(err, user) {
            if (err) {
                return next(err);
            } else {
		        user.github.token = undefined;
				user.save(function(err) {
				    res.redirect(req.header("Referer"));
				});
			}
        });
    });

    // PATCH /users/:id
    router.patch('/:id', [isLoggedIn, isUserOrAdmin, validate.body(UserSchemaPatch)], function(req, res, next) {

		// Non admin user cannot edit the roles
		if(req.body.roles && !req.user.hasRole(['admin'])) {
	        var err = new Error("Forbidden: Not allowed to edit roles for User " + req.params.id);
	        err.status = 403;
	        return next(err);
		}

        User.findOne({ 'uuid' :  req.params.id }, function(err, user) {
			if(req.body.local && (req.body.local.password != "")) {
	        	user.local.password = user.generateHash(req.body.local.password);
			}
			if(req.body.name && (req.body.name != "")) {
	        	user.name = req.body.name;
			}
			if(req.body.gender && (req.body.gender != "")) {
	        	user.gender = req.body.gender;
			}
			if(req.body.roles && (req.body.roles != "")) {
	        	user.roles = req.body.roles;
			}
			user.save(function (err) {
	            if (err)
			        return next(err);

	            res.format({
	                'application/json': function() {
	                    res.json(user);
	                },
	                'default': function() {
	                    res.send(406, 'Not Acceptable');
	                }
	            });
	        });
		});

    });

    // DELETE /users/:id
    router.delete('/:id', [isLoggedIn, hasRole(["admin"])], function(req, res, next) {

        User.findOneAndRemove({ 'uuid' :  req.params.id }, req.body, function (err, user) {
            if (err) {
                return next(err);
            } else {
                res.format({
                    'application/json': function() {
                        res.json(user);
                    },
                    'default': function() {
                        res.send(406, 'Not Acceptable');
                    }
                });
            }
        });
    });

    return router;
};

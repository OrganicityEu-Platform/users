module.exports = function(passport) {

    var express = require('express');
    var router = express.Router();
    var isLoggedIn = require('../config/isLoggedIn.js')(passport);

    //###############################################################
    // Routes
    //###############################################################

    var User = require('../models/user.js');

    router.get('/', [isLoggedIn], function(req, res) {

        User.find(function (err, users) {
            if (err) {
                return next(err);
            } else {
                res.format({
                    'text/html': function() {
                        res.render('users/users.ejs', {
                            user : req.user,
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

    router.get('/:id', [isLoggedIn], function(req, res) {

        User.findOne({ 'profile.uuid' :  req.params.id }, function(err, user) {

            if(user == null) {
                res.status(404);
            }

            if (err) {
                console.log(err);
                return next(err);
            } else {
                res.format({
                    'text/html': function() {
                        res.render('users/users.ejs', {
                            user : req.user,
                            users : [user]
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
    });

    return router;
};


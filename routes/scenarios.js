var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var validate = require('isvalid').validate;

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
router.get('/', function(req, res, next) {
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
router.post('/', validate.body(ScenarioSchemaPost), function(req, res, next) {

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
router.get('/:id', function(req, res, next) {
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
router.put('/:id', validate.body(ScenarioSchemaPost), function(req, res, next) {

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
router.patch('/:id', function(req, res, next) {

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
router.delete('/:id', function(req, res, next) {
    Scenario.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) {
            return next(err);
        } else {
            res.json(post);
        }
    });
});


module.exports = router;


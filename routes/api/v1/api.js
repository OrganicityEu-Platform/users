// DEPENDENCIES
/// express
var express = require('express');
/// router
var router = express.Router();
/// crypto
var crypto = require('crypto');

// MODELS
/// Scenario
//// @fix me
var Scenario = require('../../../models/scenario.js');

// CONFIG
/// api version
var api_version = 'v1';

// ROUTES
/// GET scenarios
//// scenarios listing (newest versions only)
router.get('/scenarios', function(req, res){
    Scenario.aggregate([
        { "$sort": { "version": -1 } },
        { "$group": {
            "_id"           : "$sid",
            "docId"         : { "$first": "$_id" },
            "version"       : { "$first": "$version" },
            "title"         : { "$first": "$title"},
            "sectors"       : { "$first": "$sectors"},
            "actors"        : { "$first": "$actors"},
            "dataSources"   : { "$first": "$dataSources"},
            "summary"       : { "$first": "$summary"},
            "narrative"     : { "$first": "$narrative"},
            "timestamp"     : { "$first": "$timestamp"}
        }}
    ], function(err, scenarios){
        if(err){
            res.send("ERROR: " + err);
        }else{
            res.status(200).json(scenarios);
        }
    });
});
/// GET scenarios/:id?
//// returns latest version of scenario by _id
//// if ?v= is set, then returns that specific scenario version
router.get('/scenarios/:id?', function(req, res) {
    // find by id only
    if(isEmptyObject(req.query)){
        Scenario.findOne({ '_id' :  req.params.id }, function(err, scenario, next) {
            if (err) {
                return res.status(404).send("NOT FOUND");
            }else {
                var sid = scenario.sid;
                //res.send(sid);

                Scenario.find({sid:sid}, null, {sort:{version:-1}, skip:0, limit:1}, function(err, scenario) {
                    if(err){
                        return res.send("ERROR: " + err);
                    }else{
                        res.status(200).json(scenario);
                    }
                });
            }
        });
        // find by id and version
    }else{
        var version = req.query.v;
        var id = req.params.id;
        var actors = req.query.actors;
        Scenario.find({ '_id' :  id },  function(err, scenario, next) {
            var sid = scenario[0].sid;
            Scenario.findOne({ 'sid': sid, 'version': version}, function(err, scenario, next){
                if(err){
                    res.status(400).send("");
                }else if(!scenario){
                    res.status(404).send("VERSION NOT FOUND");
                }else{
                    res.status(200).json(scenario);
                }
            });
        });
    }
});
/// POST scenarios
router.route('/scenarios').post(function(req, res) {

    var scenario = new Scenario(req.body);
    scenario.version = 29;
    scenario.sid = crypto.randomBytes(10).toString('hex');
    scenario.save(function(err) {
        if (err) {
            return res.send(err);
        }
        res.location('api/' + api_version + '/scenarios/' + scenario._id);
        res.send(201, "CREATED");
    });
});
/// DELETE scenarios/:id
router.route('/scenarios/:id?').delete(function(req, res) {
    if(isEmptyObject(req.query)){
        Scenario.findOne({ '_id' :  req.params.id }, function(err, scenario, next) {
            if (err) {
                return res.send("ERROR: " + err);
            }else if(!scenario){
                return res.status(404).send("NOT FOUND");
            }else {
                Scenario.remove({
                    _id: req.params.id
                }, function(err, scenario) {
                    if (err) {
                        return res.send(err);
                    }else{
                        res.status(204);
                    }
                });
            }
        });
    }else{
        Scenario.findOne({ '_id' :  req.params.id }, function(err, scenario, next) {
            if (err) {
                return res.send("ERROR: " + err);
            }else if(!scenario){
                return res.status(404).send("NOT FOUND");
            }else {
                var version = req.query.v;
                var sid = scenario.sid;

                Scenario.findOne({sid:sid, version:version}, function(err, scenario){
                    if(err){
                        return res.send("ERROR: " + err);
                    }else if(!scenario){
                        return res.status(404).send("VERSION NOT FOUND");
                    }else{
                        Scenario.remove({sid:sid, version:version}, function(err, scenario){
                            if(err){
                                return res.send("ERROR: " + err);
                            }else{
                                res.status(204).send("NO CONTENT");
                            }
                        });
                    }
                });
            }
        });
    }
});
/// PUT scenarios/:id
router.route('/scenarios/:id').put(function(req,res){
    // find it
    Scenario.findOne({ _id: req.params.id }, function(err, scenario) {
        if (err) {
            res.send(404);
        }else{
            var sid = scenario.sid;
            //var version = scenario.version
            var scenario = new Scenario(req.body);
            scenario.sid = sid;
            //scenario.version = version + 1;
            // find it's latest version
            Scenario.aggregate([

                { "$group": {
                    "_id": sid,
                    version: { $max: "$version" }
                } }
            ], function(err, data){
                if(err){
                    res.send("ERROR: " + err);
                }else{
                    var trunk = data[0];
                    var version = trunk.version + 1;
                    var sid = trunk._id;

                    scenario.version = version;
                    scenario.sid = sid;

                    scenario.save(function(err) {
                        if (err) {
                            return res.send(err);
                        }
                        res.location('/scenarios/' + scenario._id);
                        res.send(201, "Created");
                    });

                    //res.json(scenario);
                }
            });
            // save the scenario

        }
    });
});

// HELPERS
/// checks if json is empty
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

module.exports = router;
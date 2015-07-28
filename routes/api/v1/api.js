/*
    API CONFIG .......................................................  */

// get api config
var api_config = require('../config.js');
// set api version
var api_version = api_config.version;

/*
    DEPENDENCIES .....................................................  */

// express
var express = require('express');
// mongojs
var mongojs = require('mongojs');
// mongojs connect
var db = mongojs('mongodb://localhost/scenarios', ['scenarios']);
// router
var router = express.Router();
// crypto
var crypto = require('crypto');

/*
    MODELS ...........................................................  */

// Scenario model
var Scenario = require('../../../models/scenario.js');

/*
    ROUTES ...........................................................  */

                            /* SCENARIOS */
    /*                                                                  */
    /*                                                                  */
    /*                                                                  */
    /*
        GET /scenarios
            # lists newest versions only
        GET /scenarios?q=
            # full text search on title, narrative, summary
            # newest versions only
        GET /scenarios?actors=rapper,scientist&sector=fishing
            # filtered search
            # newest versions only
                                                                        */
router.get('/scenarios?', function(req, res){
    // full text search on title, narrative, summary
    if(req.query.q && Object.keys(req.query).length == 1){
        res.json(req.query);
        // @see: http://docs.mongodb.org/manual/reference/operator/query/text/
        res.send("TODO: FULL TEXT SEARCH ON TITLE,SUMMARY,NARRATIVE");
    // filtered search
    }else if(!isEmptyObject(req.query) && !req.query.q){
        // make filter
        var filtered_search = {};
        // filter sectors
        if(req.query.sectors){
            var sectors = { $in: req.query.sectors.split(",")};
            filtered_search.sectors = sectors;
        }
        // filter actors
        if(req.query.actors){
            var actors = { $in: req.query.actors.split(",")};
            filtered_search.actors = actors;
        }
        // filter devices
        if(req.query.devices){
            var devices = { $in: req.query.devices.split(",")};
            filtered_search.devices = devices;
        }
        // filter data sources
        if(req.query.dataSources){
            var dataSources = { $in: req.query.dataSources.split(",")};
            filtered_search.dataSources = dataSources;
        }
        // do filtered search
        Scenario.find(filtered_search, function(err, scenario){
            if(err){
                res.send("ERROR: " + err);
            }else{
                // version filter stage
                var sids_array = new Array(); // register sid for each group entity
                var objects = new Array(); // newest versions
                // pluck newest versions
                for(var i=0;i<scenario.length;i++){
                    // curr object
                    var obj = scenario[i];
                    // if curr obj is not registered, then dump it in and register it
                    if(!isInArray(obj.sid, sids_array)){
                        sids_array.push(obj.sid);
                        objects.push(obj);
                    // if curr obj is registered
                    }else{
                        // grab curr obj sid and version
                        var sid = obj.sid;
                        var version = obj.version;
                        // do version filtering
                        bend(sid, objects, version, obj);
                    }
                }
                res.json(objects);
            }
        });
    // get scenarios listing with latest versions
    }else{
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
    }
});

    /*
        GET /scenarios/_id
            # returns newest version of the scenario
        GET /scenarios/_id?v=
            # returns the specific version the scenario
                                                                        */
router.get('/scenarios/:id?', function(req, res) {
    // find by _id
    if(isEmptyObject(req.query)){
        Scenario.findOne({ '_id' :  req.params.id }, function(err, scenario, next) {
            if (err) {
                return res.status(404).send("NOT FOUND");
            }else {
                // grab sid
                var sid = scenario.sid;
                // find by sid, sort by version
                Scenario.find({sid:sid}, null, {sort:{version:-1}, skip:0,
                                limit:1}, function(err, scenario) {
                    if(err){
                        return res.send("ERROR: " + err);
                    }else{
                        res.status(200).json(scenario);
                    }
                });
            }
        });
    // find by _id and version
    }else{
        // grab version and _id from url
        var version = req.query.v;
        var id = req.params.id;
        // find by _id
        Scenario.find({ '_id' :  id },  function(err, scenario, next) {
            // get group sid
            var sid = scenario[0].sid;
            // find by sid and version
            Scenario.findOne({ 'sid': sid, 'version': version},
                                function(err, scenario, next){
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

    /*
        POST /scenarios
                                                                        */

router.route('/scenarios').post(function(req, res) {
    var scenario = new Scenario(req.body);
    // all new scenarios start with version 29
    scenario.version = 29;
    // generate unique grouping id
    scenario.sid = crypto.randomBytes(10).toString('hex');
    // save the scenario
    scenario.save(function(err) {
        if (err) {
            return res.send(err);
        }
        res.location('api/' + api_version + '/scenarios/' + scenario._id);
        res.send(201, "CREATED");
    });
});

    /*
        DELETE /scenarios/_id
            # delete by _id
        DELETE /scenarios/_id?v=
            # delete by _id and version
                                                                        */

router.route('/scenarios/:id?').delete(function(req, res) {
    // if delete by _id
    if(isEmptyObject(req.query)){
        // find scenario by _id
        Scenario.findOne({ '_id' :  req.params.id }, function(err, scenario, next) {
            if (err) {
                return res.send("ERROR: " + err);
            // if scenario not exist
            }else if(!scenario){
                return res.status(404).send("NOT FOUND");
            // do delete scenario by _id
            }else {
                Scenario.remove({
                    _id: req.params.id
                }, function(err, scenario) {
                    if (err) {
                        return res.send("ERROR: " + err);
                    }else{
                        res.status(204);
                    }
                });
            }
        });
    // delete by _id and version
    }else{
        // find by _id
        Scenario.findOne({ '_id' :  req.params.id }, function(err, scenario, next) {
            if (err) {
                return res.send("ERROR: " + err);
            // if scenario not exist
            }else if(!scenario){
                return res.status(404).send("NOT FOUND");
            }else {
                // grab version and unique scenario group identifier
                var version = req.query.v;
                var sid = scenario.sid;
                // find by unique scenario group identifier and version
                Scenario.findOne({sid:sid, version:version}, function(err, scenario){
                    if(err){
                        return res.send("ERROR: " + err);
                    // if scenario not exist
                    }else if(!scenario){
                        return res.status(404).send("VERSION NOT FOUND");
                    // remove scenario by unique scenario group identifier and version
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

    /*
        PUT /scenarios/_id
                                                                        */
router.route('/scenarios/:id').put(function(req,res){
    // find by _id
    Scenario.findOne({ _id: req.params.id }, function(err, scenario) {
        if (err) {
            return res.status(404);
        // if scenario not exist
        }else if(!scenario){
            return res.status(404).send("SCENARIO NOT FOUND");
        // if exist
        }else{
            // grab its unique group identifier
            var sid = scenario.sid;
            // grab body
            var scenario = new Scenario(req.body);
            // set sid to body
            scenario.sid = sid;
            // find by sid, sort by version
            db.scenarios.find({"sid":sid}).sort({version: -1}).limit(1, function(err, data){
                if(err){
                    res.send("ERROR: " + err);
                }else{
                    var trunk = data[0];
                    var version = trunk.version + 1; // increment version
                    var sid = trunk.sid; // grab the unique scenario entity id
                    scenario.version = version;
                    scenario.sid = sid;
                    // save the scenario
                    scenario.save(function(err) {
                        if (err) {
                            return res.send(err);
                        }
                        res.location('api/' + api_version + '/scenarios/' + scenario._id);
                        res.send(201, "CREATED");
                    });
                }
            });
        }
    });
});
                            /* USERS */
    /*                                                                  */
    /*                                                                  */
    /*                                                                  */
    /*
        GET /users                                                      */

router.get('/users', function(req, res){
    res.send("TODO: handle GET /users");
});

/*
        GET /users/:_id                                                 */

router.get('/users/:id', function(req, res){
    res.send("TODO: handle GET /users/:_id");
});

/*
    HELPERS ..........................................................  */

    // checks if json is empty
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}
    // check if value is in array
function isInArray(value, array) {
    return array.indexOf(value) > -1;
}
    // dump newest versions into objects array from benders
function bend(sid, arr, version, bender){
    for(var i=0;i<arr.length;i++){
        var obj = arr[i];
        if(obj.sid == sid && obj.version < version){
            arr[i] = bender;
            arr[i].version = version;
            return;
        }
    }
}
/* TODO */
// @TODO: full text search on title, summary, narrative

module.exports = router;
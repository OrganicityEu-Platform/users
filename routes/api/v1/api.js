var api = require('../../../api_routes.js');
var ui  = require('../../../ui_routes.js');

module.exports = function(passport) {

/*
    API CONFIG ............................................................................ */

    var api_config = require('../config.js');
    var api_version = api_config.version;

/*
    DEPENDENCIES .......................................................................... */

    var express = require('express');
    var router = express.Router();


    var crypto = require('crypto'); // used to generate uuid

    var mongodb = require('mongodb');
    var mongojs = require('mongojs');
    var db = mongojs('mongodb://localhost/scenarios', ['scenarios']);

    var isvalid = require('isvalid');
    var validScenario = {
        type : Object,
        unknownKeys: 'remove',
        schema : {
            'title'     : { type: String, required: true },
            'narrative' : { type: String, required: true },
            'summary'   : { type: String, required: true}
        }
    };

/*
    MODELS ................................................................................ */

    var Scenario = require('../../../models/scenario.js');

    var isLoggedIn = require('../../../models/isLoggedIn.js')(passport);
    var hasRole = require('../../../models/hasRole.js');

/*
    ROUTES ................................................................................ */

    /** SCENARIOS
     *
     * GET
     *  /scenarios
     *      # lists all scenarios, newest versions only
     *  /scenarios?q=real+slim+shady
     *      # full text search on narrative, newest versions only
     *  /scenarios?actors=rapper,scientist&sector=fishing
     *      # filtered search, newest versions only
     */
    router.get(api.route('scenario_list'), function(req, res){

        // full text search on narrative:

        if(req.query.q && Object.keys(req.query).length == 1){

            db.scenarios.find(
                // @see: http://docs.mongodb.org/manual/reference/operator/query/text/
                { $text: { $search: req.query.q} },
                { score: { $meta: "textScore" } }
            ).sort( { score: { $meta: "textScore" } }, function(err, data){
                    if(err){
                        return res.send("ERROR: " + err);
                    }else{
                        res.json(getLatestVersions(data));
                    }
                });

        // filtered search:

        }else if(!isEmptyObject(req.query) && !req.query.q){

            // make filter
            var filtered_search = {};

            // filter sectors
            if(req.query.sectors){
                // @see: http://docs.mongodb.org/manual/reference/operator/query/in/
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

            // do filtered search:

            Scenario.find(filtered_search, function(err, scenario){
                if(err){
                    res.send("ERROR: " + err);
                }else{
                   res.json(getLatestVersions(scenario));
                }
            });

        // get all new scenarios listing

        }else{
            // @see: http://docs.mongodb.org/manual/core/aggregation-introduction/
            // @see: http://docs.mongodb.org/manual/reference/method/db.collection.aggregate/
            // @see: http://docs.mongodb.org/manual/reference/operator/aggregation/group/
            // @see: http://docs.mongodb.org/manual/reference/operator/aggregation/first/
            Scenario.aggregate([
                { "$sort": { "version": -1 } },
                { "$group": {
                    "_id"           : "$uuid",
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

    /** SCENARIOS
     *
     * GET
     *  /scenarios/uuid
     *      # returns newest version of the scenario
     *  /scenarios/uuid?v=
     *      # returns the specific version the scenario
     */
    router.get(api.route('scenario_by_uuid'), function(req, res) {

        // find by uuid:

        if(isEmptyObject(req.query)){

            db.scenarios.find({"uuid":req.params.uuid}).sort({version: -1}).limit(1, function(err, scenario){
                if(err){
                    return res.status(400).send("");
                }else{
                    res.status(200).json(scenario[0]);
                }
            });

        // find by uuid and version:

        }else{

            Scenario.find({uuid : req.params.uuid , version: req.query.v}, function(err, scenario){
                if(err){
                    res.status(400).send("");
                }else{
                    res.json(scenario[0]);
                }
            });
        }
    });

    /** SCENARIOS
     *
     * POST
     */
    router.route(api.route('scenario_list')).post(function(req, res) {

        var scenario = new Scenario(req.body);

        // validate req body
        isvalid(scenario, validScenario, function(err) {
            if(err){
                res.status(400).send("Invalid keys given.");
            }
            else{
                // all new scenarios start with version 29
                scenario.version = 1;
                // generate unique grouping id
                scenario.uuid = crypto.randomBytes(10).toString('hex');
                // save the scenario
                scenario.save(function(err) {
                    if (err) {
                        return res.send(err);
                    }else{
                        res.location('api/' + api_version + '/scenarios/' + scenario._id);
                        res.status(201).json(scenario);
                    }

                });
            }
        });
    });

    /** SCENARIOS
     *
     * DELETE
     *  /scenarios/uuid
     *      # delete latest version
     *  /scenarios/_id?v=
     *      # delete by uuid and version
     */
    router.route(api.route('scenario_by_uuid')).delete(function(req, res) {

        // if delete by uuid:

        if(isEmptyObject(req.query)){
            db.scenarios.find({"uuid":req.params.uuid}).sort({version: -1}).limit(1, function(err, scenario){
                if(err){
                    return res.status(400).send("");
                }else if(!scenario){
                    return res.status(404).send("NOT FOUND");
                }else{
                    db.scenarios.remove({
                        uuid: scenario[0].uuid, version: scenario[0].version
                    }, function(err, data) {
                        if (err) {
                            return res.send("ERROR: " + err);
                        }else{
                            res.status(204);
                            res.send(data);
                        }
                    });
                }
            });

        // delete by uuid and version:

        }else{
            db.scenarios.find({"uuid":req.params.uuid, "version":parseInt(req.query.v)}, function(err, scenario){
                if(err){
                    res.send("ERROR: " + err);
                }else if(!scenario){
                    return res.status(404).send("NOT FOUND");
                }else{
                    db.scenarios.remove({
                        "uuid": req.params.uuid, "version": parseInt(req.query.v)
                    }, function(err, data) {
                        if (err) {
                            return res.send("ERROR: " + err);
                        }else{
                            res.status(204);
                            res.send(data);
                        }
                    });
                }
            });
        }
    });

    /** SCENARIOS
     *
     * PUT
     *  /scenarios/uuid
     *      # creates a new scenario under uuid and increments version
     */
    router.route(api.route('scenario_by_uuid')).put(function(req,res){

        db.scenarios.find({"uuid":req.params.uuid}).sort({version: -1}).limit(1, function(err, data){
            if(err){
                res.send(err);
            }else if(data === undefined || data.length == 0){
                res.status(404).send("SCENARIO NOT FOUND");
            }else{

                var scenario = new Scenario(req.body);
                scenario.version = data[0].version + 1;
                scenario.uuid = data[0].uuid;

                scenario.save(function(err, result) {
                    if (err) {
                        return res.send(err);
                    }
                    res.location('api/' + api_version + '/scenarios/' + scenario.uuid);
                    res.status(201).json(result);
                });
            }
        });
    });

    /** ACTORS
     *
     * GET
     */
    router.get(api.route('actors_list'), function(req, res) {
        db.scenarios.aggregate([

            { $project: { actors: 1 } },
            { $unwind: '$actors' },
            { $group:
                {
                    _id: { actor: '$actors' },
                    count: { $sum: 1 }
                }
            },
            { $sort : { count : -1 } }
        ], function(err, counts){
            if(err){
                res.send("ERROR: " + err);
            }else{
                res.status(200).json(counts);
            }
        });
    });

    /** SECTORS
     *
     * GET
     */
    router.get(api.route('sectors_list'), function(req, res) {
        db.scenarios.aggregate([

            { $project: { sectors: 1 } },
            { $unwind: '$sectors' },
            { $group:
                {
                    _id: { sector: '$sectors' },
                    count: { $sum: 1 }
                }
            },
            { $sort : { count : -1 } }
        ], function(err, counts){
            if(err){
                res.send("ERROR: " + err);
            }else{
                res.status(200).json(counts);
            }
        });
    });

    /** DEVICES
     *
     * GET
     */
    router.get(api.route('devices_list'), function(req, res) {
        db.scenarios.aggregate([

            { $project: { devices: 1 } },
            { $unwind: '$devices' },
            { $group:
                {
                    _id: { device: '$devices' },
                    count: { $sum: 1 }
                }
            },
            { $sort : { count : -1 } }
        ], function(err, counts){
            if(err){
                res.send("ERROR: " + err);
            }else{
                res.status(200).json(counts);
            }
        });
    });


    /**
        * HELPER FUNCTIONS
        ********************************************************************************** */

    function getCount(name){
        db.scenarios.aggregate([

            { $project: { name: 1 } },
            { $unwind: '$'+name },
            { $group:
            {
                _id: { toCount: '$'+name },
                count: { $sum: 1 }
            }
            },
            { $sort : { count : -1 } }
        ], function(err, counts){
            if(err){
                res.send("ERROR: " + err);
            }else{
                return counts;
            }
        });
    }



    /**
     * checks if json is empty
     * @param obj
     * @returns {boolean}
     */
    function isEmptyObject(obj) {
        return !Object.keys(obj).length;
    }
    /**
     * check if value is in array
     * @param value
     * @param array
     * @returns {boolean}
     */
    function isInArray(value, array) {
        return array.indexOf(value) > -1;
    }
    /**
     *
     * @param data array of json documents with a version key and uuid
     * @returns {Array} of newest json documents
     */
    function getLatestVersions(data){

        // @see: https://en.wikipedia.org/wiki/Umbrella_title
        var umbrellas  = new Array();
        var results     = new Array();
        // read data array
        for(var i=0;i<data.length;i++){
            // the current document being filtered from data
            var curr_doc = data[i];
            // if current document's umbrella is not registered, then register umbrella
            // and add the document to results
            if(!isInArray(curr_doc.uuid, umbrellas)){
                umbrellas.push(curr_doc.uuid); // register umbrella
                results.push(curr_doc); // add document to results
            // if current document's umbrella is already registered
            }else{
                // read results array for document under the registered umbrella
                for(var e=0;e<results.length;e++){
                    var doc = results[e];
                    // if results document version older than data document
                    // then overwrite results document with new document
                    if(doc.uuid == curr_doc.uuid && doc.version < curr_doc.version){
                        results[e] = curr_doc;
                    }
                }
            }
        }
        return results;
    }
    return router;
};

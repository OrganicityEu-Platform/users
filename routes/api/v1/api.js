var api = require('../../../api_routes.js');
var ui  = require('../../../ui_routes.js');

module.exports = function(router, passport) {

    /*
    API CONFIG ............................................................................ */

    var api_config = require('../config.js');
    var api_version = api_config.version;

    /*
    DEPENDENCIES .......................................................................... */

    // @see: https://en.wikipedia.org/wiki/Umbrella_title
    var crypto = require('crypto'); // used to generate umbrella: sid

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

    /** SCENARIOS
     *
     * GET
     *  /scenarios/sid
     *      # returns newest version of the scenario
     *  /scenarios/sid?v=
     *      # returns the specific version the scenario
     */
    router.get(api.route('scenario_by_uuid'), function(req, res) {

        // find by sid:

        if(isEmptyObject(req.query)){
            Scenario.findOne({ 'sid' :  req.params.uuid }, function(err, scenario, next) {
                if (err) {
                    return res.status(404).send("NOT FOUND");
                }else {
                    // grab sid
                    var sid = scenario.sid;
                    // find by sid, sort by version
                    Scenario.find({sid:sid}, null, {sort:{version:-1},
                                    limit:1}, function(err, scenario) {
                        if(err){
                            return res.send("ERROR: " + err);
                        }else{
                            res.status(200).json(scenario[0]);
                        }
                    });
                }
            });

        // find by sid and version:

        }else{
            // grab version and sid from url
            var version = req.query.v;
            var id = req.params.uuid;

            // find by sid
            Scenario.find({ 'sid' :  id },  function(err, scenario, next) {
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
                scenario.version = 29;
                // generate unique grouping id
                scenario.sid = crypto.randomBytes(10).toString('hex');
                // save the scenario
                scenario.save(function(err) {
                    if (err) {
                        return res.send(err);
                    }else{
                        res.location('api/' + api_version + '/scenarios/' + scenario.sid);
                        //res.send(201, "SUCCESSFULLY CREATED NEW SCENARIO.");
                        res.status(201).json(scenario);
                    }

                });
            }
        });
    });

    /** SCENARIOS
     *
     * DELETE
     *  /scenarios/sid
     *      # delete by sid
     *  /scenarios/sid?v=
     *      # delete by sid and version
     */
    router.route(api.route('scenario_by_uuid')).delete(function(req, res) {

        // if delete by sid:

        if(isEmptyObject(req.query)){
            // find scenario by sid
            Scenario.findOne({ 'sid' :  req.params.uuid }, function(err, scenario, next) {
                if (err) {
                    return res.send("ERROR: " + err);
                // if scenario not exist
                }else if(!scenario){
                    return res.status(404).send("NOT FOUND");
                // do delete scenario by sid
                }else {
                    Scenario.remove({
                        sid: req.params.uuid
                    }, function(err, scenario) {
                        if (err) {
                            return res.send("ERROR: " + err);
                        }else{
                            res.status(204);
                        }
                    });
                }
            });

        // delete by sid and version:

        }else{
            // find by sid
            Scenario.findOne({ 'sid' :  req.params.uuid }, function(err, scenario, next) {
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

    /** SCENARIOS
     *
     * PUT
     *  /scenarios/sid
     *      # creates a new scenario under umbrella of sid
     *      # and increments version
     */
    router.route(api.route('scenario_by_uuid')).put(function(req,res){
        // find by sid
        Scenario.findOne({ sid: req.params.uuid }, function(err, scenario) {
            if (err) {
                return res.status(404);
            // if scenario not exist
            }else if(!scenario){
                return res.status(404).send("SCENARIO NOT FOUND");
            // if exist
            }else{
                // grab umbrella
                var sid = scenario.sid;
                // grab body
                var scenario = new Scenario(req.body);
                // set umbrella to body
                scenario.sid = sid;
                // find by umbrella, sort by version
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
                            res.location('api/' + api_version + '/scenarios/' + scenario.sid);
                            res.status(201).send("SUCCESSFULLY UPDATED SCENARIO.");
                        });
                    }
                });
            }
        });
    });

    /** ACTORS
     *
     * GET
     */
    router.get(api.route('actors_list'), function(req, res) {
        res.send("ACTORS");
    });

    /** SECTORS
     *
     * GET
     */
    router.get(api.route('sectors_list'), function(req, res) {
        res.send("SECTOR");
    });

    /** DEVICES
     *
     * GET
     */
    router.get(api.route('devices_list'), function(req, res) {
        res.send("DEVICES");
    });


    /**
        * HELPER FUNCTIONS
        ********************************************************************************** */

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
     * @param data array of json documents with a version key and an umbrella key called sid
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
            if(!isInArray(curr_doc.sid, umbrellas)){
                umbrellas.push(curr_doc.sid); // register umbrella
                results.push(curr_doc); // add document to results
            // if current document's umbrella is already registered
            }else{
                // read results array for document under the registered umbrella
                for(var e=0;e<results.length;e++){
                    var doc = results[e];
                    // if results document version older than data document
                    // then overwrite results document with new document
                    if(doc.sid == curr_doc.sid && doc.version < curr_doc.version){
                        results[e] = curr_doc;
                    }
                }
            }
        }
        return results;
    }
    return router;
};

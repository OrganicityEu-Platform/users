var api = require('../../../api_routes.js');
var ui = require('../../../ui_routes.js');
var HashMap = require('hashmap');
var math = require('mathjs');

module.exports = function(router, passport) {

  /*
   * ########################################################################################
   * DEPENDENCIES
   * ########################################################################################
   */
  var crypto = require('crypto'); // used to generate uuid
  var mongodb = require('mongodb');
  var mongojs = require('mongojs');
  var isvalid = require('isvalid');

  var db = mongojs('mongodb://localhost/scenarios', ['scenarios']);

  var validScenario = {
    type: Object,
    unknownKeys: 'remove',
    schema: {
      'title': {type: String, required: true},
      'narrative': {type: String, required: true},
      'summary': {type: String, required: true}
    }
  };

  /*
   * ########################################################################################
   * MODELS
   * ########################################################################################
   */

  var Scenario = require('../../../models/scenario.js');
  var isLoggedIn = require('../../../models/isLoggedIn.js')(passport);
  var isUserOrAdmin = require('../../../models/isUserOrAdmin.js');

  /*
   * ########################################################################################
   * ROUTES
   * ########################################################################################
   */

  /*
   * SCENARIOS
   *
   * GET
   *  /scenarios
   *      # lists all scenarios, newest versions only
   *  /scenarios?q=real+slim+shady
   *      # full text search on narrative, newest versions only
   *  /scenarios?actors=rapper,scientist&sector=fishing
   *      # filtered search, newest versions only
   */
  router.get(api.route('scenario_list'), function(req, res) {

    // full text search on narrative:

    if (req.query.q && Object.keys(req.query).length === 1) {

      db.scenarios.ensureIndex(
        { title: 'text', summary : 'text', narrative : 'text' },
        { name: 'title_text_summary_text_narrative_text' },
        function(err, data) {
          if (err) {
            return res.send('ERRROR: ' + err);
          } else {
            db.scenarios.find(
              // @see: http://docs.mongodb.org/manual/reference/operator/query/text/
              // @see: http://docs.mongodb.org/manual/core/index-text/#create-text-index
              {$text: {$search: req.query.q}},
              {score: {$meta: 'textScore'}}
            ).sort({score: {$meta: 'textScore'}}, function(err, data) {
              if (err) {
                return res.send('ERRROR: ' + err);
              } else {
                res.json(getLatestVersions(data));
              }
            });
          }
        }
      ); //creates the index if not exists

      // filtered search:
    } else if (req.query.creator && Object.keys(req.query).length === 1) {
      db.scenarios.find({creator: req.query.creator}, function(err, scenarios) {
        if (err) {
          res.send(err);
        } else {
          res.status(200).json(getLatestVersions(scenarios));
        }
      });
    } else if (!isEmptyObject(req.query) && !req.query.q && !req.query.creator) {

      // make filter
      var filtered_search = {};

      // filter sectors
      if (req.query.sectors) {
        // @see: http://docs.mongodb.org/manual/reference/operator/query/in/
        var sectors = {$in: req.query.sectors.split(',')};
        filtered_search.sectors = sectors;
      }
      // filter actors
      if (req.query.actors) {
        var actors = {$in: req.query.actors.split(',')};
        filtered_search.actors = actors;
      }
      // filter devices
      if (req.query.devices) {
        var devices = {$in: req.query.devices.split(',')};
        filtered_search.devices = devices;
      }
      // filter data sources
      if (req.query.dataSources) {
        var dataSources = {$in: req.query.dataSources.split(',')};
        filtered_search.dataSources = dataSources;
      }

      // do filtered search:

      Scenario.find(filtered_search, function(err, scenario) {
        if (err) {
          res.send('ERROR: ' + err);
        } else {
          res.json(scenario);
        }
      });

      // get all new scenarios listing

    } else {

      var filterLatestVersions = function(allScenariosAndVersions) {
        var scenariosByUUID = {};
        allScenariosAndVersions.forEach(function(scenario) {
          if (!Array.isArray(scenariosByUUID[scenario.uuid])) {
            scenariosByUUID[scenario.uuid] = [];
          }
          scenariosByUUID[scenario.uuid].push(scenario);
        });
        var result = [];
        for (var uuid in scenariosByUUID) {
          var newestVersion = 0;
          var newest = function(prev, curr) {
            return prev.version > curr.version ? prev : curr;
          };
          result.push(scenariosByUUID[uuid].reduce(newest, scenariosByUUID[uuid][0]));
        }
        return result;
      };

      var query = Scenario.find();

      var validSortFields = ['title', 'timestamp'];
      if (req.query.sortBy && validSortFields.indexOf(req.query.sortBy) > -1) {
        query = query.sort(req.query.sortBy);
      }

      query.exec(function(err, allScenariosAndVersions) {
        if (err) {
          return res.send('ERROR: ' + err);
        } else {
          res.json(filterLatestVersions(allScenariosAndVersions));
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

    if (isEmptyObject(req.query)) {

      db.scenarios.find({'uuid': req.params.uuid}).sort({version: -1}).limit(1, function(err, scenario) {
        if (err) {
          return res.status(400).send('');
        } else {
          res.status(200).json(scenario[0]);
        }
      });

      // find by uuid and version:

    } else {

      Scenario.find({uuid: req.params.uuid, version: req.query.v}, function(err, scenario) {
        if (err) {
          res.status(400).send('');
        } else {
          res.json(scenario[0]);
        }
      });
    }
  });

  /** SCENARIOS
   *
   * POST
   */
  router.post(api.route('scenario_list'), [isLoggedIn], function(req, res) {

    var scenario = new Scenario(req.body);

    // validate req body
    isvalid(scenario, validScenario, function(err) {
      if (err) {
        res.status(400).send('Invalid keys given.');
      } else {
        scenario.version = 1;
        // generate unique grouping id
        scenario.uuid = crypto.randomBytes(10).toString('hex');
        scenario.creator = req.user.uuid;
        // save the scenario
        scenario.save(function(err) {
          if (err) {
            return res.send(err);
          } else {
            res.location(api.reverse('scenario_by_uuid', {uuid: scenario.uuid}));
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
  router.delete(api.route('scenario_by_uuid'), [isLoggedIn], function(req, res) {

    // if delete by uuid:

    if (isEmptyObject(req.query)) {
      db.scenarios.find({'uuid': req.params.uuid}).sort({version: -1}).limit(1, function(err, scenarios) {
        if (err) {
          return res.status(400).send('');
        } else if (!scenarios || scenarios.length === 0) {
          return res.status(404).send('NOT FOUND');
        } else {
          if (req.user && scenarios[0].creator === req.user.uuid && isUserOrAdmin) {
            db.scenarios.remove({
            uuid: scenarios[0].uuid, version: scenarios[0].version
          }, function(err, data) {
            if (err) {
              return res.send('ERROR: ' + err);
            } else {
              res.status(204);
              res.send(data);
            }
          });
          } else {
            res.status(403).send('NOT ALLOWED');
          }
        }
      });

      // delete by uuid and version:

    } else {
      db.scenarios.find({'uuid': req.params.uuid, 'version': parseInt(req.query.v)}, function(err, scenario) {
        if (err) {
          res.send('ERROR: ' + err);
        } else if (!scenario) {
          return res.status(404).send('NOT FOUND');
        } else {
          if (req.user && scenario[0].creator === req.user.uuid && isUserOrAdmin) {
            db.scenarios.remove({
            'uuid': req.params.uuid, 'version': parseInt(req.query.v)
          }, function(err, data) {
            if (err) {
              return res.send('ERROR: ' + err);
            } else {
              res.status(204);
              res.send(data);
            }
          });
          } else {
            res.status(403).send('NOT ALLOWED');
          }
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
  router.put(api.route('scenario_by_uuid'), [isLoggedIn], function(req, res) {

    db.scenarios.find({'uuid': req.params.uuid}).sort({version: -1}).limit(1, function(err, oldVersion) {
      if (err) {
        res.send(err);
      } else if (oldVersion === undefined || oldVersion.length === 0) {
        res.status(404).send('SCENARIO NOT FOUND');
      } else {

        var fieldsInUpdate = ['title', 'summary', 'narrative', 'sectors', 'actors', 'devices'];
        var update = req.body;
        var newVersion = new Scenario();
        fieldsInUpdate.forEach(function(field) {
          newVersion[field] = update[field];
        });
        newVersion.uuid = oldVersion[0].uuid;
        newVersion.version = oldVersion[0].version + 1;
        newVersion.creator = req.user.uuid;
        if (req.user && oldVersion[0].creator === req.user.uuid && isUserOrAdmin) {
          newVersion.save(function(err, scenario) {
          if (err) {
            return res.send(err);
          }
          res.location(api.reverse('scenario_by_uuid', {uuid: scenario.uuid}));
          res.status(201).json(scenario);
        });
        } else {
          res.status(403).send('NOT ALLOWED');
        }
      }
    });
  });

  /** ACTORS
   *
   * GET
   */
  router.get(api.route('actors_list'), function(req, res) {
    db.scenarios.aggregate([

      {$project: {actors: 1}},
      {$unwind: '$actors'},
      {
        $group: {
          _id: {actor: '$actors'},
          count: {$sum: 1}
        }
      },
      {$sort: {count: -1}}
    ], function(err, counts) {
      if (err) {
        res.send('ERROR: ' + err);
      } else {
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

      {$project: {sectors: 1}},
      {$unwind: '$sectors'},
      {
        $group: {
          _id: {sector: '$sectors'},
          count: {$sum: 1}
        }
      },
      {$sort: {count: -1}}
    ], function(err, counts) {
      if (err) {
        res.send('ERROR: ' + err);
      } else {
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

      {$project: {devices: 1}},
      {$unwind: '$devices'},
      {
        $group: {
          _id: {device: '$devices'},
          count: {$sum: 1}
        }
      },
      {$sort: {count: -1}}
    ], function(err, counts) {
      if (err) {
        res.send('ERROR: ' + err);
      } else {
        res.status(200).json(counts);
      }
    });

  });

  /** SCENARIOS
   *
   * GET
   *  /scenarios/related/uuid
   *      # returns newest version of the scenario
   */
  router.get(api.route('related_by_uuid'), function(req, res) {
    // find by uuid:
    if (isEmptyObject(req.query)) {

      db.scenarios.find({'uuid': req.params.uuid}).sort({version: -1}).limit(1, function(err, scenario) {
        if (err) {
          return res.status(400).send('');
        } else {
          // this is used also somewhere else, make a common function
          var filterLatestVersions = function(allScenariosAndVersions) {
            var scenariosByUUID = {};
            allScenariosAndVersions.forEach(function(scenario) {
              if (!Array.isArray(scenariosByUUID[scenario.uuid])) {
                scenariosByUUID[scenario.uuid] = [];
              }
              scenariosByUUID[scenario.uuid].push(scenario);
            });
            var result = [];
            for (var uuid in scenariosByUUID) {
              var newestVersion = 0;
              var newest = function(prev, curr) {
                return prev.version > curr.version ? prev : curr;
              };
              result.push(scenariosByUUID[uuid].reduce(newest, scenariosByUUID[uuid][0]));
            }
            return result;
          };

          //evaluate similarity metric against all other scenarios (naive approach) must change to a map-reduce query at mongodb
          var query = Scenario.find();
          query.exec(function(err, allScenariosAndVersions) {
            if (err) {
              return res.send('ERROR: ' + err);
            } else {
              var simMatrix = new Array();
              var scenarioHash = new HashMap();
              var scenariosList = filterLatestVersions(allScenariosAndVersions);
              console.info(scenario[0]);
              for (var doc in scenariosList) {
                if (scenariosList[doc].uuid === scenario[0].uuid) {
                  continue;
                }
                simMatrix[scenariosList[doc].uuid] = sim(scenario[0], scenariosList[doc]);
                console.info(scenariosList[doc]);
                console.info(simMatrix[scenariosList[doc].uuid]);
                scenarioHash.set(scenariosList[doc].uuid, scenariosList[doc]);
              }
              var answer = getRelatedScenarios(simMatrix, scenarioHash);
              res.status(200).json(answer);
            }
          });
        }
      });
    } else {
      res.status(400).send('');
    }
  });

  /*
   * ########################################################################################
   * HELPER FUNCTIONS
   * ########################################################################################
   */
  function getCount(name, res) {
    db.scenarios.aggregate([
      {$project: {name: 1}},
      {$unwind: '$' + name},
      {
        $group: {
          _id: {toCount: '$' + name},
          count: {$sum: 1}
        }
      },
      {$sort: {count: -1}}
    ], function(err, counts) {
      if (err) {
        res.send('ERROR: ' + err);
      } else {
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
  function getLatestVersions(data) {
    // @see: https://en.wikipedia.org/wiki/Umbrella_title
    var umbrellas = [];
    var results = [];
    // read data array
    for (var i = 0; i < data.length; i++) {
      // the current document being filtered from data
      var curr_doc = data[i];
      // if current document's umbrella is not registered, then register umbrella
      // and add the document to results
      if (!isInArray(curr_doc.uuid, umbrellas)) {
        umbrellas.push(curr_doc.uuid); // register umbrella
        results.push(curr_doc); // add document to results
        // if current document's umbrella is already registered
      } else {
        // read results array for document under the registered umbrella
        for (var e = 0; e < results.length; e++) {
          var doc = results[e];
          // if results document version older than data document
          // then overwrite results document with new document
          if (doc.uuid === curr_doc.uuid && doc.version < curr_doc.version) {
            results[e] = curr_doc;
          }
        }
      }
    }
    return results;
  }
  return router;
};

/**
 *
 * @param simMatrix hash uuid->similarity of scores
 * @param scenarioHash hash uuid->scenario
 * @returns {Array} of scenarios with similarity in decreasing order
 */
function getRelatedScenarios(simMatrix, scenarioHash) {
  var keys = [];
  Object.keys(simMatrix)
    .map(function(k) {
      return [k, simMatrix[k]];
    })
    .sort(function(a, b) {
      if (a[1] > b[1]) {
        return -1;
      }else {
        return 1;
      }
    })
    .forEach(function(d) {
      keys.push(scenarioHash.get(d[0]));
    });
  return keys;
}

/**
 *
 * @param document d1
 * @param document d2
 * @returns Similarity between d1, d2 --naive to extend
 */
function sim(d1, d2) {
  var score = KeywordSimilarity(d1.title,d2.title) + KeywordSimilarity(d1.sectors.join(),d2.sectors.join()) ;
  score += KeywordSimilarity(d1.actors.join(),d2.actors.join());
  score += KeywordSimilarity(d1.devices.join(),d2.devices.join());
  return score / 4;
}

function TextToVector(text, bagofwords) {
  return bagofwords.map(function(word) {
    return text.split(' ').filter(function(x) {
      return x === word;
    }).length;
  });
};

function KeywordSimilarity(text1, text2) {
  text1 += ' ';
  text1 = text1.replace('.',' ').replace(',',' ').toLowerCase();
  text2 = text2.replace('.',' ').replace(',',' ').toLowerCase();
  var total = text1.concat(text2).split(' ');
  var allwords = total.filter(function(word, pos) {
    return total.indexOf(word) === pos;
  });
  var arr1 = TextToVector(text1, allwords);
  var arr2 = TextToVector(text2, allwords);
  return math.dot(arr1, arr2) / (math.norm(arr1) * math.norm(arr2));
};

function checkNested(obj) {
  var args = Array.prototype.slice.call(arguments, 1);
  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}

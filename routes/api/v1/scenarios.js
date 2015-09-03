var api        = require('../../../api_routes.js');
var ui         = require('../../../ui_routes.js');
var HashMap    = require('hashmap');
var math       = require('mathjs');
var crypto     = require('crypto'); // used to generate uuid
var mongodb    = require('mongodb');
var mongojs    = require('mongojs');
var isvalid    = require('isvalid');
var HttpStatus = require('http-status');
var Scenario   = require('../../../models/scenario.js');

var db = mongojs('mongodb://localhost/scenarios', ['scenarios']);

var validScenario = {
  type: Object,
  unknownKeys: 'remove',
  schema: {
    'title'     : {type: String, required: true},
    'narrative' : {type: String, required: true},
    'summary'   : {type: String, required: true}
  }
};

/**
 * Used to project all fields in the scenario collection documents to the fields that the user is
 * allowed to see.
 */
var scenarioProjection = {
  _id         : 0,
  uuid        : 1,
  version     : 1,
  title       : 1,
  summary     : 1,
  narrative   : 1,
  creator     : 1,
  timestamp   : 1,
  actors      : 1,
  sectors     : 1,
  devices     : 1,
  dataSources : 1
};

/**
 * Array of all fields contained in the scenario schema. Used e.g., to validate request query
 * parameter 'sortBy'.
 */
var scenarioFields = Object
  .keys(scenarioProjection)
  .filter(function(key) { return scenarioProjection[key] === 1; });

module.exports = function(router, passport) {

  var isLoggedIn             = require('../../../models/isLoggedIn.js')(passport);

  var scenarioListQueryCallback = function(res, multipleResults) {
    return function(err, scenarios) {

      if (err) {
        console.log(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        return;
      }

      if (multipleResults) {
        res.status(HttpStatus.OK).send(scenarios);
        return;
      }

      if (scenarios.length === 0) {
        res.status(HttpStatus.NOT_FOUND).send();
        return;
      }

      res.status(HttpStatus.OK).send(scenarios[0]);
    };
  };

  var executeScenarioLatestVersionQuery = function(params, res, multipleResults) {

    // console.log('executeScenarioLatestVersionQuery');

    var sortByVersionDescending = {
      '$sort' : { 'uuid' : 1, 'version' : -1 }
    };

    var groupByVersionReturnFirst = {
      '$group' : {
        '_id'         : '$uuid',
        'uuid'        : { '$first' : '$uuid'        },
        'version'     : { '$first' : '$version'     },
        'title'       : { '$first' : '$title'       },
        'summary'     : { '$first' : '$summary'     },
        'narrative'   : { '$first' : '$narrative'   },
        'creator'     : { '$first' : '$creator'     },
        'timestamp'   : { '$first' : '$timestamp'   },
        'actors'      : { '$first' : '$actors'      },
        'sectors'     : { '$first' : '$sectors'     },
        'devices'     : { '$first' : '$devices'     },
        'dataSources' : { '$first' : '$dataSources' }
      }
    };

    var projectScenarioFields = {
      '$project' : scenarioProjection
    };

    var pipeline = [];

    if (params.filter && !isEmptyObject(params.filter)) {
      pipeline.push({ '$match' : params.filter});
    }

    pipeline.push(sortByVersionDescending);
    pipeline.push(groupByVersionReturnFirst);
    pipeline.push(projectScenarioFields);

    if (params.sort && !isEmptyObject(params.sort)) {
      pipeline.push({ '$sort' : params.sort });
    }

    if (params.skip) {
      pipeline.push({ '$skip'  : params.skip });
    }

    if (params.limit) {
      pipeline.push({ '$limit' : params.limit  });
    }

    // console.log('query aggregation pipeline', pipeline);

    return Scenario.aggregate(pipeline, scenarioListQueryCallback(res, multipleResults));
  };

  /**
   * Executes a query against the scenarios collection
   */
  var executeScenarioListQuery = function(params, res, multipleResults) {
    return Scenario
      .find(params.filter, scenarioProjection)
      .sort(params.sort)
      .limit(params.limit)
      .exec(scenarioListQueryCallback(res, multipleResults));
  };

  var validateAndGetBaseParams = function(req, res) {

    if (req.query.version && 'all' !== req.query.version && isNaN(req.query.version)) {
      throw 'request parameter "version" is not a valid number: "' + req.query.version + '"';
    }

    if (req.query.skip && isNaN(req.query.skip)) {
      throw 'request parameter "skip" is not a valid number: "' + req.query.skip + '"';
    }

    if (req.query.limit && isNaN(req.query.limit)) {
      throw 'request parameter "limit" is not a valid number: "' + req.query.limit + '"';
    }

    if (req.query.sortBy && scenarioFields.indexOf(req.query.sortBy.trim()) === -1) {
      throw 'sortBy parameter "' + req.query.sortBy + '" is invalid. Use one of [' +
        scenarioFields.join(',') + '].';
    }

    var validSortOrders = ['asc','ASC','desc','DESC'];
    if (req.query.sortDir && validSortOrders.indexOf(req.query.sortDir.trim()) === -1) {
      throw 'sortDir parameter "' + req.query.sortDir + '" is invalid. Use one of [' +
        validSortOrders.join(',') + '].';
    }

    var params = {
      filter         : {},
      sort           : {},
      skip           : req.query.skip  ? parseInt(req.query.skip)  : undefined,
      limit          : req.query.limit ? parseInt(req.query.limit) : undefined
    };

    if (req.query.sortBy) {
      if (!req.query.sortDir) {
        req.query.sortDir = 'ASC';
      }
      params.sort[req.query.sortBy.trim()] = req.query.sortDir === 'ASC' || req.query.sortDir === 'asc' ? 1 : -1;
    }

    return params;
  };

  var processQueryByScenarioUUID = function(uuid, req, res) {

    var params;
    try {
      params = validateAndGetBaseParams(req, res);
    } catch (msg) {
      return res.status(HttpStatus.BAD_REQUEST).send(msg);
    }

    if (!req.query.version) {

      params.filter.uuid    = uuid;
      params.filter.version = req.query.version;
      params.sort.version   = -1; // overrides sorting query parameters

      return executeScenarioListQuery(params, res, false);

    } else {

      if ('all' === req.query.version) {

        params.filter.uuid    = uuid;
        params.sort.version   = -1; // overrides sorting query parameters

        return executeScenarioListQuery(params, res, true);
      }

      params.filter.uuid    = uuid;
      params.filter.version = req.query.version;

      return executeScenarioListQuery(params, res, false);
    }
  };

  router.get(api.route('scenario_list'), function(req, res) {

    var params;
    try {
      params = validateAndGetBaseParams(req, res);
    } catch (msg) {
      return res.status(HttpStatus.BAD_REQUEST).send(msg);
    }

    // console.log('querying scenario list with base params', params);

    var trimString = function(t) {
      return t.trim();
    };

    // query without filters, by UUID or by UUID with version (no other filters allowed if UUID set)
    if (isEmptyObject(req.query)) {
      return executeScenarioLatestVersionQuery(params, res, true);
    } else if (req.query.uuid) {
      return processQueryByScenarioUUID(req.query.uuid, req, res);
    }

    // other filters can be combined:
    // - full text search ?q
    // - tag matches sector, actors, devices, data sources
    // - creator search

    if (req.query.q) {
      params.filter.$text = {
        $search : req.query.q.trim()
      };
      params.sort.score = {
        $meta : 'textScore'
      };
    }

    if (req.query.creator) {
      params.filter.creator = req.query.creator;
    }

    if (req.query.sectors) {
      params.filter.sectors = {
        $all : req.query.sectors.split(',').map(trimString)
      };
    }

    if (req.query.actors) {
      params.filter.actors = {
        $all : req.query.actors.split(',').map(trimString)
      };
    }

    if (req.query.devices) {
      params.filter.devices = {
        $all: req.query.devices.split(',').map(trimString)
      };
    }

    if (req.query.dataSources) {
      params.filter.dataSources = {
        $all: req.query.dataSources.split(',').map(trimString)
      };
    }

    return executeScenarioLatestVersionQuery(params, res, true);
  });

  router.get(api.route('scenario_by_uuid'), function(req, res) {
    return processQueryByScenarioUUID(req.params.uuid, req, res);
  });

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

  router.put(api.route('scenario_by_uuid'), [isLoggedIn], function(req, res) {
    Scenario.find({ uuid : req.params.uuid }).sort({ version : -1 }).limit(1).exec(function(err, oldVersion) {

      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }

      if (oldVersion === undefined || oldVersion.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).send();
      }

      if (!req.user.hasRole(['admin']) && req.user.uuid !== oldVersion[0].creator) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .send('You must be either the creator of the scenario or an adminstrator to update it');
      }

      var fieldsInUpdate = ['title', 'summary', 'narrative', 'sectors', 'actors', 'devices'];
      var update = req.body;
      var newVersion = new Scenario();
      fieldsInUpdate.forEach(function(field) {
        newVersion[field] = update[field];
      });
      newVersion.uuid = oldVersion[0].uuid;
      newVersion.version = oldVersion[0].version + 1;
      newVersion.creator = req.user.uuid;

      newVersion.save(function(err, scenario) {
        if (err) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        }
        res.location(api.reverse('scenario_by_uuid', {uuid: scenario.uuid}));
        res.status(HttpStatus.CREATED).json(scenario);
      });
    });
  });

  router.delete(api.route('scenario_by_uuid'), [isLoggedIn], function(req, res) {

    // delete latest version
    if (isEmptyObject(req.query)) {

      Scenario.find({ uuid : req.params.uuid }).sort({ version : -1 }).limit(1).exec(function(err, scenarios) {

        if (err) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        }

        if (!scenarios || scenarios.length === 0) {
          return res.status(HttpStatus.NOT_FOUND).send();
        }

        if (!req.user.hasRole(['admin']) && req.user.uuid !== scenarios[0].creator) {
          return res
            .status(HttpStatus.FORBIDDEN)
            .send('You must be either the creator of the scenario or an adminstrator to update it');
        }

        Scenario.findOneAndRemove({ uuid: scenarios[0].uuid, version : scenarios[0].version }, function(err, data) {
          if (err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
          } else {
            return res.status(HttpStatus.NO_CONTENT).send();
          }
        });
      });

      // delete by uuid and version:

    } else {

      Scenario.find({ uuid : req.params.uuid, version : parseInt(req.query.version) }).exec(function(err, scenario) {

        if (err) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        }

        if (!scenarios || scenarios.length === 0) {
          return res.status(HttpStatus.NOT_FOUND).send();
        }

        if (!req.user.hasRole(['admin']) && req.user.uuid !== oldVersion[0].creator) {
          return res
            .status(HttpStatus.FORBIDDEN)
            .send('You must be either the creator of the scenario or an adminstrator to update it');
        }

        Scenario.remove({ uuid : req.params.uuid, version : parseInt(req.query.version)}).exec(function(err, data) {
          if (err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
          }
          return res.status(HttpStatus.NO_CONTENT).send();
        });
      });
    }
  });

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

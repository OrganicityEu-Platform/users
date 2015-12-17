var api          = require('../../../api_routes.js');
var ui           = require('../../../ui_routes.js');
var HashMap      = require('hashmap');
var math         = require('mathjs');
var crypto       = require('crypto'); // used to generate uuid
var mongodb      = require('mongodb');
var HttpStatus   = require('http-status');
var RestClient   = require('node-rest-client').Client;
var Report       = require('../../../models/schema/report.js');
var User         = require('../../../models/schema/user.js');
var uuid         = require('node-uuid');
var handleUpload = require('../../../util/handleUpload');

var validate     = require('express-validation');
// TODO ???  var ReportJoi  = require('../../../models/joi/report.js');

var configAuth   = require('../../../config/auth.js');

/**
 * Used to project all fields in the report collection documents to the fields that the user is
 * allowed to see.
 */
var reportProjection = {
  _id         : 0,
  uuid        : 1,
  version     : 1,
  title       : 1,
  abstract    : 1,
  year        : 1,
  area        : 1,
  creator     : 1,
  timestamp   : 1,
  image       : 1,
  thumbnail   : 1,
  copyright   : 1,
  credit      : 1,
  areas        : 1,
  domains      : 1,
  organizations: 1,
  orgtypes     : 1,
  types        : 1,
  approaches   : 1,
  tags         : 1
};

var fieldsInUpdate = [
  'title',
  'abstract',
  'thumbnail',
  'image',
  'copyright',
  'credit',
  'areas',
  'domains',
  'organizations',
  'orgtypes',
  'types',
  'approaches',
  'tags'
];

/**
 * Array of all fields contained in the report schema. Used e.g., to validate request query
 * parameter 'sortBy'.
 */
var reportFields = Object
  .keys(reportProjection)
  .filter(function(key) { return reportProjection[key] === 1; });

var getUsernames = function() {
  return User.find({}).select('uuid name').exec();
};

var annotateUsernames = function(results) {
  var reports = results[0];
  var users = results[1];

  var annotatedReports = reports.map(function(report) {
    if (report.creator) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].uuid === report.creator) {
          report.creatorName = users[i].name;
          break;
        }
      }
    }

    return report;
  });

  return annotatedReports;
};

module.exports = function(router, passport) {

  var isLoggedIn = require('../../../models/isLoggedIn.js')(passport);

  var sendReports = function(res, multipleResults) {
    return function(reports) {
      if (multipleResults) {
        res.status(HttpStatus.OK).send(reports);
        return;
      }

      if (reports.length === 0) {
        res.status(HttpStatus.NOT_FOUND).send();
        return;
      }

      res.status(HttpStatus.OK).send(reports[0]);
    };
  };

  var reportError = function(res) {
    return function(error) {
      console.log('ERROR: ', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    };
  };

  var executeReportLatestVersionQuery = function(params, res, multipleResults) {
    var sortByVersionDescending = {
      '$sort' : { 'uuid' : 1, 'version' : -1 }
    };

    var groupByVersionReturnFirst = {
      '$group' : {
        '_id'         : '$uuid',
        'uuid'        : { '$first' : '$uuid'        },
        'version'     : { '$first' : '$version'     },
        'title'       : { '$first' : '$title'       },
        'abstract'    : { '$first' : '$abstract'    },
        'year'        : { '$first' : 'year'         },
        'creator'     : { '$first' : '$creator'     },
        'timestamp'   : { '$first' : '$timestamp'   },
        'image'       : { '$first' : 'image'        },
        'thumbnail'   : { '$first' : '$thumbnail'   },
        'copyright'   : { '$first' : '$thumbnail'   },
        'credit'      : { '$first' : '$credit'      },
        'areas'        : { '$first' : '$areas'        },
        'domains'      : { '$first' : '$domains'      },
        'organizations': { '$first' : '$organizations'},
        'orgtypes'     : { '$first' : '$orgtypes'     },
        'types'        : { '$first' : '$types'        },
        'approaches'   : { '$first' : '$approaches'   },
        'tags'         : { '$first' : '$tags'         }
      }
    };

    var projectReportFields = {
      '$project' : reportProjection
    };

    // https://docs.mongodb.org/manual/core/aggregation-pipeline/
    var pipeline = [];

    if (params.filter && !isEmptyObject(params.filter)) {
      pipeline.push({ '$match' : params.filter});
    }

    pipeline.push(sortByVersionDescending);
    pipeline.push(groupByVersionReturnFirst);
    pipeline.push(projectReportFields);

    if (params.sort && !isEmptyObject(params.sort)) {
      pipeline.push({ '$sort' : params.sort });
    }

    if (params.skip) {
      pipeline.push({ '$skip'  : params.skip });
    }

    if (params.limit) {
      pipeline.push({ '$limit' : params.limit  });
    }

    var reports = Report.
      aggregate(pipeline).
      exec();
    var users = getUsernames();

    return Promise.all([reports, users]).
      then(annotateUsernames).
      then(sendReports(res, multipleResults)).
      catch(reportError(res));
  };

  /**
   * Executes a query against the reports collection
   */
  var executeReportListQuery = function(params, res, multipleResults) {
    return Promise.resolve(
      Report
        .find(params.filter, reportProjection)
        .sort(params.sort)
        .limit(params.limit)
        .exec())
      .then(sendReports(res, multipleResults))
      .catch(reportError(res));
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

    if (req.query.sortBy && reportFields.indexOf(req.query.sortBy.trim()) === -1) {
      throw 'sortBy parameter "' + req.query.sortBy + '" is invalid. Use one of [' +
        reportFields.join(',') + '].';
    }

    var validSortOrders = ['asc', 'ASC', 'desc', 'DESC'];
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

  var processQueryByReportUUID = function(uuid, req, res) {

    var params;
    try {
      params = validateAndGetBaseParams(req, res);
    } catch (msg) {
      return res.status(HttpStatus.BAD_REQUEST).send(msg);
    }

    if (!req.query.version) {

      params.filter.uuid    = uuid;
      params.sort.version   = -1; // overrides sorting query parameters

      return executeReportListQuery(params, res, false);

    } else {

      if ('all' === req.query.version) {

        params.filter.uuid    = uuid;
        params.sort.version   = -1; // overrides sorting query parameters

        return executeReportListQuery(params, res, true);
      }

      params.filter.uuid    = uuid;
      params.filter.version = req.query.version;

      return executeReportListQuery(params, res, false);
    }
  };

  router.get(api.route('report_list'), function(req, res) {
    var params;
    try {
      params = validateAndGetBaseParams(req, res);
    } catch (msg) {
      return res.status(HttpStatus.BAD_REQUEST).send(msg);
    }

    // console.log('querying report list with base params', params);

    var trimString = function(t) {
      return t.trim();
    };

    // query without filters, by UUID or by UUID with version (no other filters allowed if UUID set)
    if (isEmptyObject(req.query)) {
      return executeReportLatestVersionQuery(params, res, true);
    } else if (req.query.uuid) {
      return processQueryByReportUUID(req.query.uuid, req, res);
    }

    // other filters can be combined:
    // - full text search ?q
    // - tag matches
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

    if (req.query.areas) {
      params.filter.areas = {
        $all : req.query.areas.split(',').map(trimString)
      };
    }

    if (req.query.domains) {
      params.filter.domains = {
        $all : req.query.domains.split(',').map(trimString)
      };
    }

    if (req.query.organizations) {
      params.filter.organizations = {
        $all : req.query.organizations.split(',').map(trimString)
      };
    }

    if (req.query.orgtypes) {
      params.filter.orgtypes = {
        $all : req.query.orgtypes.split(',').map(trimString)
      };
    }

    if (req.query.types) {
      params.filter.types = {
        $all : req.query.types.split(',').map(trimString)
      };
    }

    if (req.query.approaches) {
      params.filter.approaches = {
        $all : req.query.approaches.split(',').map(trimString)
      };
    }

    if (req.query.tags) {
      params.filter.tags = {
        $all : req.query.tags.split(',').map(trimString)
      };
    }

    return executeReportLatestVersionQuery(params, res, true);
  });

  router.get(api.route('report_by_uuid'), function(req, res) {
    return processQueryByReportUUID(req.params.uuid, req, res);
  });

  // TODO ??? router.post(api.route('report_list'), [isLoggedIn, validate(ScenarioJoi.createOrUpdate)], function(req, res, next) {
  router.post(api.route('report_list'), [isLoggedIn], function(req, res, next) {
    if (req.body.thumbnail && !req.body.image) {
      var err = new Error('Image not given');
      err.status = HttpStatus.BAD_REQUEST;
      return next(err);
    }

    if (!req.body.thumbnail && req.body.image) {
      var err = new Error('Thumbnail not given');
      err.status = HttpStatus.BAD_REQUEST;
      return next(err);
    }

    handleUpload(req.body.thumbnail, next, function(path) {
      req.body.thumbnail = path;

      //console.log('Thumbnail OK');

      handleUpload(req.body.image, next, function(path) {

        //console.log('Image OK');

        req.body.image = path;

        var report = new Report(req.body);

        report.version = 1;
        // generate unique grouping id
        report.uuid = uuid.v4();
        report.creator = req.user.uuid;
        // save the report
        report.save(function(err) {
          if (err) {
            return res.send(err);
          } else {
            res.location(api.reverse('report_by_uuid', {uuid: report.uuid}));
            res.status(201).json(report.toObject());
          }
        });
      });
    });
  });

  // TODO ???   router.put(api.route('report_by_uuid'), [isLoggedIn, validate(ReportJoi.createOrUpdate)],
  router.put(api.route('report_by_uuid'), [isLoggedIn],
    function(req, res, next) {

      if (req.body.thumbnail && !req.body.image) {
        var err = new Error('Image not given');
        err.status = HttpStatus.BAD_REQUEST;
        return next(err);
      }

      if (!req.body.thumbnail && req.body.image) {
        var err = new Error('Thumbnail not given');
        err.status = HttpStatus.BAD_REQUEST;
        return next(err);
      }

      handleUpload(req.body.thumbnail, next, function(path) {
        req.body.thumbnail = path;

        handleUpload(req.body.image, next, function(path) {
          req.body.image = path;

          Report.find({ uuid : req.params.uuid }).sort({ version : -1 }).limit(1).exec(function(err, oldVersion) {

            if (err) {
              return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
            }

            if (oldVersion === undefined || oldVersion == null || oldVersion.length === 0) {
              return res.status(HttpStatus.NOT_FOUND).send();
            }

            if (
              !req.user.hasRole(['admin']) &&
              !req.user.hasRole(['moderator']) &&
              req.user.uuid !== oldVersion[0].creator
            ) {
              return res
                .status(HttpStatus.FORBIDDEN)
                .send('You must be either the creator of the report or an adminstrator to update it');
            }

            var update = req.body;
            var newVersion = new Report();
            fieldsInUpdate.forEach(function(field) {
              newVersion[field] = update[field];
            });
            newVersion.uuid = oldVersion[0].uuid;
            newVersion.version = oldVersion[0].version + 1;
            newVersion.creator = req.user.uuid;

            newVersion.save(function(err, report) {
              if (err) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
              }
              res.location(api.reverse('report_by_uuid', {uuid: report.uuid}));
              res.status(HttpStatus.CREATED).json(report.toObject());
            });
          });
        });
      });
    }
  );

  router.delete(api.route('report_by_uuid'), [isLoggedIn], function(req, res) {

    // delete latest version
    if (isEmptyObject(req.query)) {

      Report.find({ uuid : req.params.uuid }).sort({ version : -1 }).limit(1).exec(function(err, reports) {

        if (err) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        }

        if (!reports || reports.length === 0) {
          return res.status(HttpStatus.NOT_FOUND).send();
        }

        if (!req.user.hasRole(['admin']) && req.user.uuid !== reports[0].creator) {
          return res
            .status(HttpStatus.FORBIDDEN)
            .send('You must be either the creator of the report or an adminstrator to update it');
        }

        Report.findOneAndRemove({ uuid: reports[0].uuid, version : reports[0].version }, function(err, data) {
          if (err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
          } else {
            // check if there's still a version left and if so return it. otherwise return NO_CONTENT
            Report.find({ uuid : req.params.uuid }).sort({ version : -1 }).limit(1).exec(function(err, reports) {
              if (!reports || reports.length === 0) {
                return res.status(HttpStatus.NO_CONTENT).send();
              }
              return res.status(HttpStatus.OK).send(reports[0]);
            });
          }
        });
      });

      // delete by uuid and version:

    } else {

      Report.find({ uuid : req.params.uuid, version : parseInt(req.query.version) }).exec(function(err, report) {

        if (err) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        }

        if (!reports || reports.length === 0) {
          return res.status(HttpStatus.NOT_FOUND).send();
        }

        if (!req.user.hasRole(['admin']) && req.user.uuid !== oldVersion[0].creator) {
          return res
            .status(HttpStatus.FORBIDDEN)
            .send('You must be either the creator of the report or an adminstrator to update it');
        }

        Report.remove({ uuid : req.params.uuid, version : parseInt(req.query.version)}).exec(function(err, data) {
          if (err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
          }
          return res.status(HttpStatus.NO_CONTENT).send();
        });
      });
    }
  });

  var aggregateTags = function(fieldName) {
    return function(req, res) {

      var fieldProjection;

      fieldProjection = {};
      fieldProjection.$project = {};
      fieldProjection.$project[fieldName] = 1;

      Report.aggregate([
        fieldProjection,
        { $unwind : '$' + fieldName },
        {
          $group: {
            _id   : { actor : '$' + fieldName },
            tag   : { '$first' : '$' + fieldName },
            count : { $sum : 1 }
          }
        },
        {$project: { _id : 0, tag : 1, count : 1 }},
        {$sort: {count: -1}}
      ], standardJsonCallback(req, res));
    };
  };

  var standardJsonCallback = function(req, res) {
    return function(err, json) {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      return res.status(HttpStatus.OK).json(json);
    };
  };

  // TAG AGGREGATION
  // TODO
  // router.get(api.route('actors_list'),  aggregateTags('actors'));
  // router.get(api.route('sectors_list'), aggregateTags('sectors'));
  // router.get(api.route('devices_list'), aggregateTags('devices'));

  // router.get(api.route('related_by_uuid'), function(req, res) {
  //   // find by uuid:
  //   if (isEmptyObject(req.query)) {
  //     var params = {
  //       filter: {},
  //       sort: {},
  //       skip: req.query.skip ? parseInt(req.query.skip) : undefined,
  //       limit: req.query.limit ? parseInt(req.query.limit) : undefined
  //     };
  //     var params2 = JSON.parse(JSON.stringify(params));
  //     params2.filter.uuid = req.params.uuid;
  //     params2.sort.version = -1; // overrides sorting query parameters
  //     try {
  //       //console.log(params2);
  //       Scenario.find(params2.filter, scenarioProjection).sort(params2.sort).limit(1).exec(
  //         function(err, s) {
  //           if (err) {
  //             res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
  //           }
  //           if (s.length === 0) {
  //             res.status(HttpStatus.NOT_FOUND).send('The input scenario not found.');
  //             return;
  //           }
  //           var params3 = JSON.parse(JSON.stringify(params));
  //           params3.sort.version = -1; // overrides sorting query parameters
  //           //console.log(params3);
  //           Scenario.find(params3.filter, scenarioProjection).sort(params3.sort).limit(params3.limit).exec(
  //             function(err, scenariosList) {
  //               if (err) {
  //                 res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
  //                 return;
  //               }
  //               try {
  //                 var simMatrix = new Array();
  //                 var scenarioHash = new HashMap();
  //                 for (var doc in scenariosList) {
  //                   if (scenariosList[doc].uuid === s[0].uuid) {
  //                     continue;
  //                   }
  //                   simMatrix[scenariosList[doc].uuid] = sim(s[0], scenariosList[doc]);
  //                   //console.info(scenariosList[doc]);
  //                   //console.info(simMatrix[scenariosList[doc].uuid]);
  //                   scenarioHash.set(scenariosList[doc].uuid, scenariosList[doc]);
  //                 }
  //                 var answer = getRelatedScenarios(simMatrix, scenarioHash);
  //                 res.status(200).json(answer);
  //                 return;
  //               } catch (err) {
  //                 res.status(HttpStatus.INTERNAL_SERVER_ERROR).json('Error' + err);
  //               }
  //             }
  //           );
  //         }
  //       );
  //     } catch (err) {
  //       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json('Error' + err);
  //     }
  //   }
  // });

  // router.get(api.route('discus_statistics'), function(req, res) {
  //   // find by uuid:
  //   if (isEmptyObject(req.query)) {
  //     var params = {
  //       filter: {},
  //       sort: {},
  //       skip: req.query.skip ? parseInt(req.query.skip) : undefined,
  //       limit: req.query.limit ? parseInt(req.query.limit) : undefined
  //     };
  //     var params2 = JSON.parse(JSON.stringify(params));
  //     params2.filter.uuid = req.params.uuid;
  //     params2.sort.version = -1; // overrides sorting query parameters
  //     try {
  //       Scenario.find(params2.filter, scenarioProjection).sort(params2.sort).limit(1).exec(
  //         function(err, s) {
  //           if (err) {
  //             res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
  //           }
  //           if (s.length === 0) {
  //             res.status(HttpStatus.NOT_FOUND).send('The input scenario not found.');
  //             return;
  //           }
  //           args = {
  //             parameters: {
  //               'thread:ident': s[0].uuid,
  //               'forum': 'organicity',
  //               'api_secret': configAuth.disqusAuth.clientSecret
  //             },
  //           };
  //           console.log(args);
  //           client = new RestClient();
  //           client.get('http://disqus.com/api/3.0/threads/details.json', args, function(data, response) {
  //             var stats = {
  //               likes: undefined,
  //               dislikes: undefined,
  //               comments: undefined
  //             };
  //             if (response.statusCode === HttpStatus.OK) {
  //               stats.likes = data.response.likes;
  //               stats.dislikes = data.response.dislikes;
  //               stats.comments = data.response.posts;
  //               return res.status(HttpStatus.OK).json(stats);
  //             } else {
  //               return res.status(HttpStatus.NO_CONTENT).json(stats);
  //             }
  //           });
  //         }
  //       );
  //     } catch (err) {
  //       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json('Error' + err);
  //     }
  //   }
  // });

  /*
   * ########################################################################################
   * HELPER FUNCTIONS
   * ########################################################################################
   */

  /**
   * checks if json is empty
   * @param obj
   * @returns {boolean}
   */
  function isEmptyObject(obj) {
    return !Object.keys(obj).length;
  }

  // *
  //  * check if value is in array
  //  * @param value
  //  * @param array
  //  * @returns {boolean}
  // function isInArray(value, array) {
  //   return array.indexOf(value) > -1;
  // }

  //   /**
  //    *
  //    * @param data array of json documents with a version key and uuid
  //    * @returns {Array} of newest json documents
  //    */
  //   function getLatestVersions(data) {
  //     // @see: https://en.wikipedia.org/wiki/Umbrella_title
  //     var umbrellas = [];
  //     var results = [];
  //     // read data array
  //     for (var i = 0; i < data.length; i++) {
  //       // the current document being filtered from data
  //       var curr_doc = data[i];
  //       // if current document's umbrella is not registered, then register umbrella
  //       // and add the document to results
  //       if (!isInArray(curr_doc.uuid, umbrellas)) {
  //         umbrellas.push(curr_doc.uuid); // register umbrella
  //         results.push(curr_doc); // add document to results
  //         // if current document's umbrella is already registered
  //       } else {
  //         // read results array for document under the registered umbrella
  //         for (var e = 0; e < results.length; e++) {
  //           var doc = results[e];
  //           // if results document version older than data document
  //           // then overwrite results document with new document
  //           if (doc.uuid === curr_doc.uuid && doc.version < curr_doc.version) {
  //             results[e] = curr_doc;
  //           }
  //         }
  //       }
  //     }
  //     return results;
  //   }

  return router;
};

// /**
//  *
//  * @param simMatrix hash uuid->similarity of scores
//  * @param scenarioHash hash uuid->scenario
//  * @returns {Array} of scenarios with similarity in decreasing order
//  */
// function getRelatedScenarios(simMatrix, scenarioHash) {
//   var keys = [];
//   Object.keys(simMatrix)
//     .map(function(k) {
//       return [k, simMatrix[k]];
//     })
//     .sort(function(a, b) {
//       if (a[1] > b[1]) {
//         return -1;
//       }else {
//         return 1;
//       }
//     })
//     .forEach(function(d) {
//       keys.push(scenarioHash.get(d[0]));
//     });
//   return keys;
// }

// /**
//  *
//  * @param document d1
//  * @param document d2
//  * @returns Similarity between d1, d2 --naive to extend
//  */
// function sim(d1, d2) {
//   var score = KeywordSimilarity(d1.title, d2.title) + KeywordSimilarity(d1.sectors.join(), d2.sectors.join()) ;
//   score += KeywordSimilarity(d1.actors.join(), d2.actors.join());
//   score += KeywordSimilarity(d1.devices.join(), d2.devices.join());
//   return score / 4;
// }

// function TextToVector(text, bagofwords) {
//   return bagofwords.map(function(word) {
//     return text.split(' ').filter(function(x) {
//       return x === word;
//     }).length;
//   });
// };

// function KeywordSimilarity(text1, text2) {
//   text1 += ' ';
//   text1 = text1.replace('.', ' ').replace(',', ' ').toLowerCase();
//   text2 = text2.replace('.', ' ').replace(',', ' ').toLowerCase();
//   var total = text1.concat(text2).split(' ');
//   var allwords = total.filter(function(word, pos) {
//     return total.indexOf(word) === pos;
//   });
//   var arr1 = TextToVector(text1, allwords);
//   var arr2 = TextToVector(text2, allwords);
//   return math.dot(arr1, arr2) / (math.norm(arr1) * math.norm(arr2));
// };

// function checkNested(obj) {
//   var args = Array.prototype.slice.call(arguments, 1);
//   for (var i = 0; i < args.length; i++) {
//     if (!obj || !obj.hasOwnProperty(args[i])) {
//       return false;
//     }
//     obj = obj[args[i]];
//   }
//   return true;
// }

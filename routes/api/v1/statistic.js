var api           = require('../../../api_routes.js');
var HttpStatus    = require('http-status');
var Scenario     = require('../../../models/schema/scenario.js');

module.exports = function(router, passport) {

  router.get(api.route('statistics'), function(req, res) {

    var arr;
    var match;
    var filter = [];

    if (req.query.type === 'scenarios_by_sector') {
      arr = 'sectors';
      // match =>
      match = { $match : { 'isCurrentVersion' : true, category: { $in: req.query.match } }};
    }

    if (req.query.type === 'scenarios_by_actor') {
      arr = 'actors';
      // match =>
      match = { $match : { 'isCurrentVersion' : true, category: { $in: req.query.match } }};
    }

    if (req.query.type === 'scenarios_by_devices') {
      arr = 'devices';
      // match =>
      match = { $match : { 'isCurrentVersion' : true, category: { $in: req.query.match } }};
    }

    filter = [
      { $unwind : '$' + arr },
      { $group : {
        _id : { uuid : '$uuid' },
        doc : { $push : { version : '$version', category : '$' + arr } },
        maxVersion : { $max : '$version' } }
      },
      { $unwind : '$doc' },
      { $project : {
        _id : 0,
        uuid : '$id.uuid',
        category : '$doc.category',
        'isCurrentVersion' : { $eq : ['$doc.version', '$maxVersion'] } }
      },
      // match =>
      { $match : { 'isCurrentVersion' : true }},
      { $group : {
        _id : '$category',
        count : { $sum : 1 } }
      }
    ];

    // match =>
    if (req.query.match) { filter.splice(4, 1, match); }

    var query = Scenario.aggregate(filter);

    query.exec(function(err, result) {
        if (err) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
          return;
        }
        return res.status(HttpStatus.OK).send(result);
      });
  });

  return router;
};

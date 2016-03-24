var api           = require('../../../api_routes.js');
var uuid          = require('node-uuid');
var Rating        = require('../../../models/schema/rating.js');
var HttpStatus    = require('http-status');

module.exports = function(router, passport) {
  router.patch(api.route('ratings_list'), function(req, res, next) {

    var filter = {};

    if (req.body.user) {
      filter.user = req.body.user;
    }

    if (req.body.scenario.uuid) {
      filter['scenario.uuid'] = req.body.scenario.uuid;
    }

    Rating.findOne(filter).exec(function(err, rating) {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      if (!rating) {
        return res.status(HttpStatus.NOT_FOUND).send();
      }
      if (req.body.rating) {
        rating.rating = req.body.rating;
      }
      rating.save(function(err, rating) {
        if (err) {
          console.log(err);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        }
        return res.status(HttpStatus.OK).send(rating.toObject());
      });
    });
  });
  router.get(api.route('ratings_list'), function(req, res) {
    var filter = {};

    if (req.query.user_uuid) {
      filter.user = req.query.user_uuid;
    }

    if (req.query.scenario_uuid) {
      filter['scenario.uuid'] = req.query.scenario_uuid;
    }

    var query = Rating.find(filter);
    query.exec(function(err, ratings) {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      return res.status(HttpStatus.OK).send(ratings.map(function(ratings) {
        return ratings.toObject();
      }));
    });
  });
  router.get(api.route('ratings_by_scenario'), function(req, res) {

    var query = Rating.aggregate([
      {$group: {_id: '$scenario.uuid', average: { $avg: '$rating' }}},
      {$match: {_id: req.params.uuid }}]);

    query.exec(function(err, ratings) {
        if (err) {
          console.log(err);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        }
        if (ratings[0]) {
          var result = ratings[0];
          result.uuid = result._id;
          delete result._id;
          return res.status(HttpStatus.OK).json(result);
        }
        res.send(ratings);
      });
  });
  router.post(api.route('ratings_list'), function(req, res, next) {
    var rating = new Rating(req.body);
    rating.uuid = uuid.v4();
    rating.save(function(err) {
      if (err) {
        return res.send(err);
      }else {
        res.status(201).json(rating.toObject());
      }
    });
  });
  return router;
};

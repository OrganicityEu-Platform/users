var api         = require('../../../api_routes.js');
var uuid        = require('node-uuid');
var Rating      = require('../../../models/schema/rating.js');
var HttpStatus    = require('http-status');

module.exports = function(router, passport) {
  router.get(api.route('ratings_list'), function(req, res) {
    var filter = {};
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

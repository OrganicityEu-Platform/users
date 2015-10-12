var api = require('../../../api_routes.js');
var redis = require('redis-client').createClient();

module.exports = function(router, passport) {

  router.get(api.route('counter'), function(req, res) {
    var key = 'organicity-scenario-tool:' + req.params.scope + ':' + req.params.id;
    redis.incr(key, function(err, reply) {
      res.json({
        scope : req.params.scope,
        id : req.params.id,
        counter : reply
      });
    });
  });

  return router;
};


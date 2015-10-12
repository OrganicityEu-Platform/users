module.exports = function(router, passport) {

  var api = require('../../../api_routes.js');
  var Counters = require('../../../models/schema/counters');

  router.get(api.route('counter'), function(req, res) {
    var key = 'organicity-scenario-tool:' + req.params.scope + ':' + req.params.id;

    Counters.increment(key, function(err, reply) {
      res.json({
        scope : req.params.scope,
        id : req.params.id,
        counter : reply.next
      });
    });
  });

  return router;
};


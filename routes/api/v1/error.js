var api = require('../../../api_routes.js');

// erroring routes for testing error handling during development
module.exports = function(router, passport) {

  var error = function(req, res) {
    res.status(500).send('Interacting with this resource always results in an error!');
  }

  router.get(api.route('error'), error);
  router.post(api.route('error'), error);
  router.put(api.route('error'), error);
  router.delete(api.route('error'), error);

  return router;
}

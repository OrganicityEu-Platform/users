var api        = require('../../../api_routes.js');
var HttpStatus = require('http-status');

module.exports = function(router, passport) {

  var isLoggedIn = require('../../../models/isLoggedIn.js')(passport);

  router.get(api.route('questionnaire'), [isLoggedIn], function(req, res) {
    res.status(HttpStatus.NOT_IMPLEMENTED).send();
  });

  router.patch(api.route('questionnaire'), function(req, res) {
    res.status(HttpStatus.NOT_IMPLEMENTED).send();
  });

  router.post(api.route('questionnaire'), function(req, res) {
    res.status(HttpStatus.NOT_IMPLEMENTED).send();
  });

  return router;
};

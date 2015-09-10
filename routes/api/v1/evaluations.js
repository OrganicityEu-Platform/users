var api        = require('../../../api_routes.js');
var HttpStatus = require('http-status');

module.exports = function(router, passport) {

  router.get(api.route('questionnaire'), function(req, res) {
    res.status(HttpStatus.NOT_IMPLEMENTED).send();
  });

  router.patch(api.route('questionnaire'), function(req, res) {
    res.status(HttpStatus.NOT_IMPLEMENTED).send();
  });

  router.post(api.route('questionnaire'), function(req, res) {
    res.status(HttpStatus.NOT_IMPLEMENTED).send();
  });
};

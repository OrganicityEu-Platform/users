var api        = require('../../../api_routes.js');
var HttpStatus = require('http-status');

module.exports = function(router, passport) {

  router.get(api.route('evaluations_list'), function(req, res) {
    res.status(HttpStatus.NOT_IMPLEMENTED).send();
  });

  router.get(api.route('evaluation_by_uuid'), function(req, res) {
    res.status(HttpStatus.NOT_IMPLEMENTED).send();
  });

  router.post(api.route('evaluations'), function(req, res) {
    res.status(HttpStatus.NOT_IMPLEMENTED).send();
  });

  router.patch(api.route('evaluation_by_uuid'), function(req, res) {
    res.status(HttpStatus.NOT_IMPLEMENTED).send();
  });
};

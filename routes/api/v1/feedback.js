var api           = require('../../../api_routes.js');
var uuid          = require('node-uuid');
var Feedback      = require('../../../models/schema/feedback.js');
var HttpStatus    = require('http-status');

module.exports = function(router, passport) {

  var isLoggedIn = require('../../../models/isLoggedIn.js')(passport);

  router.get(api.route('feedback_list'), [isLoggedIn], function(req, res) {
    var filter = {};
    var query = Feedback.find(filter);
    query.exec(function(err, feedback) {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      return res.status(HttpStatus.OK).send(feedback.map(function(feedback) {
        return feedback.toObject();
      }));
    });
  });
  router.get(api.route('feedback_by_scenario'), [isLoggedIn], function(req, res) {
    Feedback.find({'scenario.uuid': req.params.uuid}, function(err, feedback) {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      return res.status(HttpStatus.OK).send(feedback);
    });
  });
  router.post(api.route('feedback_list'), [isLoggedIn], function(req, res, next) {
    var feedback = new Feedback(req.body);
    feedback.uuid = uuid.v4();
    feedback.save(function(err) {
      if (err) {
        return res.send(err);
      }else {
        res.status(201).json(feedback.toObject());
      }
    });

  });
  router.get(api.route('feedback_by_user'), [isLoggedIn], function(req, res) {
    Feedback.find({ user : req.params.uuid }, function(err, feedback) {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      var evaluations = feedback;
      var evaluatedScenarios = [];

      for (e = 0; e < evaluations.length; e++) {
        evaluatedScenarios.push(evaluations[e].scenario);
      }
      return res.status(HttpStatus.OK).send(evaluatedScenarios);
    });
  });
  return router;
};

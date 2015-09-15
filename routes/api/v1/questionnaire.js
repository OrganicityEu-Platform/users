var api                 = require('../../../api_routes.js');
var HttpStatus          = require('http-status');
var validate            = require('express-validation');
var QuestionnaireJoi = require('../../../models/joi/questionnaire.js');
var Questionnaire       = require('../../../models/schema/questionnaire.js');

module.exports = function(router, passport) {

  var isLoggedIn = require('../../../models/isLoggedIn.js')(passport);

  router.get(api.route('questionnaire'), [validate(QuestionnaireJoi.get)], function(req, res) {

    var callback = function(multipleResults) {
      return function(err, questionnaires) {
        if (err) {
          console.log(err);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        }
        if (questionnaires.length === 0) {
          return res.status(HttpStatus.NOT_FOUND).send();
        }
        if (multipleResults) {
          return res.status(HttpStatus.OK).send(questionnaires.map(function(q) { return q.toObject(); }));
        }
        return res.status(HttpStatus.OK).send(questionnaires[0].toObject());
      };
    };

    if ('all' === req.query.version) {
      Questionnaire.find().sort({ 'version' : -1 }).exec(callback(true));
    } else if (req.query.version) {
      Questionnaire.find({ version : parseInt(req.query.version) }).exec(callback(false));
    } else {
      Questionnaire.find().sort({ 'version' : -1 }).limit(1).exec(callback(false));
    }
  });

  var replaceWithNewVersion = function(req, res) {
    if (!req.user.hasRole(['admin'])) {
      return res.status(HttpStatus.FORBIDDEN).send();
    }
    Questionnaire.find().sort({ 'version' : -1 }).exec(function(err, questionnaires) {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      req.body.version = questionnaires.length === 0 ? 1 : (questionnaires[0].version + 1);
      req.body.author  = req.user.uuid;
      var newVersion = new Questionnaire(req.body);
      newVersion.save(function(err) {
        if (err) {
          console.log(err);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        }
        return res.status(HttpStatus.OK).send(newVersion.toObject());
      });
    });
  };

  router.patch(
    api.route('questionnaire'),
    [isLoggedIn, validate(QuestionnaireJoi.postAndPut)],
    replaceWithNewVersion
  );

  router.post(
    api.route('questionnaire'),
    [isLoggedIn, validate(QuestionnaireJoi.postAndPut)],
    replaceWithNewVersion
  );

  return router;
};

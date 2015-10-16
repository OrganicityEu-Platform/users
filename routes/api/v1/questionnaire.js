var api              = require('../../../api_routes.js');
var HttpStatus       = require('http-status');
var validate         = require('express-validation');
var QuestionnaireJoi = require('../../../models/joi/questionnaire.js');
var Questionnaire    = require('../../../models/schema/questionnaire.js');

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
          return res.status(HttpStatus.OK).send({
            description : 'Initial description',
            explanation : 'Initial explanation',
            questions : [{
              tech: true,
              text: 'Hypothetical tech initial question: do you like it?',
              values: [
                { value: 'No way!',                   weight: -2 },
                { value: 'Hmmmm... (sceptical tone)', weight: -1 },
                { value: 'Well... ok',                weight: 0 },
                { value: 'Sounds alright',            weight: 1 },
                { value: 'Hell yeah!',                weight: 2 }
              ]
            },{
              tech: false,
              text: 'Hypothetical non-tech initial question: do you like it?',
              values: [
                { value: 'No way!',                   weight: -2 },
                { value: 'Hmmmm... (sceptical tone)', weight: -1 },
                { value: 'Well... ok',                weight: 0 },
                { value: 'Sounds alright',            weight: 1 },
                { value: 'Hell yeah!',                weight: 2 }
              ]
            }]
          });
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

  //router.post(api.route('questionnaire'),[isLoggedIn, validate(QuestionnaireJoi.postAndPut)],replaceWithNewVersion);
  router.post(api.route('questionnaire'),[isLoggedIn],replaceWithNewVersion);

  var patchExistingVersion = function(req, res) {
    if (!req.user.hasRole(['admin'])) {
      return res.status(HttpStatus.FORBIDDEN).send();
    }
    Questionnaire.find().sort({ 'version' : -1 }).exec(function(err, questionnaires) {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }

      var updatedVersion = new Questionnaire(req.body);
      var dbVersion = questionnaires[0];
      dbVersion.description = updatedVersion.description;
      dbVersion.explanation = updatedVersion.explanation;
      var toSave = true;
      if (updatedVersion.questions.length === dbVersion.questions.length) {
        for (var i = 0; i < updatedVersion.questions.length; i++) {
          var updatedQuestion = updatedVersion.questions[i];
          var dbQuestion = dbVersion.questions[i];
          if (updatedQuestion.values.length === dbQuestion.values.length) {
            for (var j = 0; i < updatedQuestion.values.length; i++) {
              dbQuestion.values[i].value = updatedQuestion.values[i].value;
              //dbQuestion.values[i].weight = updatedQuestion.values[i].weight;
            }
          } else {
            toSave = false;
            break;
          }
        }
      } else {
        toSave = false;
      }
      if (toSave === false) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('The questionnaire has not identical structure');
      }
      dbVersion.save(function(err) {
        if (err) {
          console.log(err);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        }
        return res.status(HttpStatus.OK).send(dbVersion.toObject());
      });
    });
  };
  //router.patch(api.route('questionnaire'),[isLoggedIn,validate(QuestionnaireJoi.postAndPut)],replaceWithNewVersion);
  router.patch(api.route('questionnaire'),[isLoggedIn],patchExistingVersion); //todo add validator
  return router;
};

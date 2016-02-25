var api           = require('../../../api_routes.js');
var Evaluation    = require('../../../models/schema/evaluation.js');
var HttpStatus    = require('http-status');
var uuid          = require('node-uuid');
var validate      = require('express-validation');
var EvaluationJoi = require('../../../models/joi/evaluation.js');
var Scenario      = require('../../../models/schema/scenario.js');

module.exports = function(router, passport) {

  var isLoggedIn = require('../../../models/isLoggedIn.js')(passport);
  var hasRole    = require('../../../models/hasRole.js')(passport);

  router.get(api.route('evaluations_list'), [isLoggedIn],  function(req, res) {

    if (!req.user.hasRole(['admin']) && !req.user.hasRole(['moderator'])) {
      return res.status(HttpStatus.FORBIDDEN).send();
    }
    if (req.query.scenario_version && !req.query.scenario_uuid) {
      return res.status(HttpStatus.BAD_REQUEST).send('scenario_version query parameter requires scenario_uuid');
    }

    var filter = {};
    if (req.query.scenario_uuid) {
      filter['scenario.uuid'] = req.query.scenario_uuid;
    }
    if (req.query.scenario_version) {
      filter['scenario.version'] = req.query.scenario_version;
    }
    if (req.query.user_uuid) {
      filter.user = req.query.user_uuid;
    }
    var query = Evaluation.find(filter);
    if (req.query.skip && !isNaN(req.query.skip)) {
      query = query.skip(parseInt(req.query.skip));
    }
    if (req.query.limit && !isNaN(req.query.limit)) {
      query = query.limit(parseInt(req.query.limit));
    }
    query.exec(function(err, evaluations) {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      return res.status(HttpStatus.OK).send(evaluations.map(function(evaluation) {
        return evaluation.toObject();
      }));
    });
  });

  router.get(api.route('evaluation_by_uuid'), [isLoggedIn], function(req, res) {
    if (!req.user.hasRole(['admin']) && !req.user.hasRole(['moderator'])) {
      return res.status(HttpStatus.FORBIDDEN).send();
    }
    Evaluation.findOne({ uuid : req.params.uuid }, function(err, evaluation) {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      return res.status(HttpStatus.OK).send(evaluation.toObject());
    });
  });

  router.get(api.route('evaluation_by_user'), [isLoggedIn], function(req, res) {
    Evaluation.find({ user : req.params.uuid }, function(err, evaluation) {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }

      var evaluations = evaluation;
      var evaluatedScenarios = [];

      for (e = 0; e < evaluations.length; e++) {
        evaluatedScenarios.push(evaluations[e].scenario);
      }
      return res.status(HttpStatus.OK).send(evaluatedScenarios);
    });
  });

  var evaluationUpdateFields = ['scenario', 'submitted', 'answers', 'comment'];
  var forbiddenUpdateFields = ['uuid', 'user', 'timestamp'];

  router.post(api.route('evaluations_list'), function(req, res) {
    if (forbiddenUpdateFields.some(function(field) { return req.body[field]; })) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Not allowed to post fields [' + forbiddenUpdateFields.join(', ') + '].');
    }

    if (!req.body.scenario || !req.body.scenario.uuid || !req.body.scenario.version) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Missing scenario, scenario UUID and/or scenario version in request body');
    }

    var evaluation = new Evaluation(req.body);
    evaluation.uuid = uuid.v4();
    if (req.user === undefined) {
      evaluation.user = 'Anonymous';
    } else {
      evaluation.user = req.user.uuid;
    }
    evaluation.timestamp = new Date().toISOString();

    if (isEvaluationComplete(evaluation) === false) {
      return res
        .status(HttpStatus.PARTIAL_CONTENT)
        .send('You have to complete all questions of the evaluations.');
    }
    evaluation.save(function(err) {

      console.log('Saved evaluation: ', evaluation);

      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      calculateScore(evaluation.scenario.uuid);
      Evaluation.findOne({ uuid : evaluation.uuid }, function(err, retrieved) {
        if (err) {
          console.log(err);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        }
        res.location(api.reverse('evaluation_by_uuid', { uuid: retrieved.uuid }));
        return res.status(HttpStatus.OK).send(retrieved.toObject());
      });
    });
  });

  router.patch(api.route('evaluation_by_uuid'), [isLoggedIn, validate(EvaluationJoi)], function(req, res) {
    Evaluation.findOne({ uuid : req.params.uuid }).exec(function(err, evaluation) {
      if (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      if (!evaluation) {
        return res.status(HttpStatus.NOT_FOUND).send();
      }
      if (evaluation.user !== req.user.uuid) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .send('You are not the creator of the evaluation with UUID ' + req.params.uuid);
      }
      if (evaluation.submitted) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .send('Evaluation was already flagged as submitted, can\'t be changed afterwards.');
      }
      if (req.user === undefined) {
        evaluation.user = 'Anonymous';
      } else {
        evaluation.user = req.user.uuid;
      }
      evaluation.timestamp = new Date().toISOString();
      if (isEvaluationComplete(evaluation) === false) {
        return res
          .status(HttpStatus.PARTIAL_CONTENT)
          .send('You have to complete all questions of the evaluations.');
      }

      evaluationUpdateFields.forEach(function(field) {
        evaluation[field] = req.body[field];
      });
      evaluation.timestamp = new Date().toISOString();

      evaluation.save(function(err) {
        if (err) {
          console.log(err);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        }
        calculateScore(evaluation.uuid);
        return res.status(HttpStatus.OK).send(evaluation.toObject());
      });
    });
  });

  return router;
};
/*
 * ########################################################################################
 * HELPER FUNCTIONS
 * ########################################################################################
/**
 * checks if json is empty
 * @param evaluation
 * @returns {integer}
 */
function calculateScore(uuid) {

  console.log('calculateScore: ', uuid);

  if (uuid === undefined) {
    return 0;
  }
  var scenarioUuid = uuid;
  var filter = {};
  if (scenarioUuid) {
    filter['scenario.uuid'] = scenarioUuid;
  }
  var query = Evaluation.find(filter);
  query.exec(function(err, evaluations) {
    console.log('evaluations', evaluations);
    if (err) {
      console.log(err);
      return 0;
    }
    var score = processEvaluations(evaluations);
    console.log('score: ', score);
    Scenario.find({ uuid : scenarioUuid }).sort({ version : -1 }).limit(1).exec(function(err, scenarios) {
      if (err) {
        console.log(err);
        return 0;
      }
      if (!scenarios || scenarios.length === 0) {
        return 0;
      }
      scenarios[0].score = score;
      scenarios[0].save(function(err) {
        if (err) {
          console.log(err);
          return 0;
        }
        return;
      });
    });
    return score;
  });
}

function processEvaluations(evaluations) {
  var techScoreStructure = {};
  var nonTechScoreStructure = {};
  var numOfTechEvaluations = 0;
  var numOfNonTechEvaluations = 0;
  for (var evaluation = 0; evaluation < evaluations.length; evaluation++) {
    var techTotal = 0;
    var techAnswers = 0;
    var noTechTotal = 0;
    var noTechAnswers = 0;
    for (var answer = 0; answer < evaluations[evaluation].answers.length; answer++) {
      if (evaluations[evaluation].answers[answer]._doc.question.tech === true) {
        techTotal++;
        if (evaluations[evaluation].answers[answer]._doc.answer &&
           evaluations[evaluation].answers[answer]._doc.answer.value !== undefined) {
          techAnswers++;
        }
      } else {
        noTechTotal++;
        if (evaluations[evaluation].answers[answer]._doc.answer &&
            evaluations[evaluation].answers[answer]._doc.answer.value !== undefined) {
          noTechAnswers++;
        }
      }
    }
    if (techTotal === techAnswers) { //pure tech evaluation
      numOfTechEvaluations++;
      techScoreStructure = processEvaluation(evaluations[evaluation], true, techScoreStructure);

    } else if (noTechTotal === noTechAnswers) { //pure non-tech evaluation
      numOfNonTechEvaluations++;
      nonTechScoreStructure = processEvaluation(evaluations[evaluation], false, nonTechScoreStructure);
    } else {
      //incomplete evaluation- do nonthing....
    }
  }
  var techTotalScore = totalScore(techScoreStructure, numOfTechEvaluations);
  var nonTechTotalScore = totalScore(nonTechScoreStructure, numOfNonTechEvaluations);
  var scores = {
    tech: techTotalScore.toFixed(2),
    noTech: nonTechTotalScore.toFixed(2),
    numOfEvaluations: numOfTechEvaluations + numOfNonTechEvaluations
  };
  return scores;
}

function processEvaluation(evaluation, tech, structure) {
  for (var answer = 0; answer < evaluation.answers.length; answer++) {
    if (evaluation.answers[answer]._doc.question.tech === tech) {
      if (evaluation.answers[answer]._doc.answer.value === undefined) { continue; }
      var answerUuid = getQuestionAnserUUID(evaluation.answers[answer]._doc.question,
        evaluation.answers[answer]._doc.answer.value);
      if (structure[answerUuid]) {
        structure[answerUuid] += evaluation.answers[answer]._doc.answer.weight;
      } else {
        structure[answerUuid] = evaluation.answers[answer]._doc.answer.weight;
      }
    }
  }
  return structure;
}

function isEvaluationComplete(evaluation) {
  var techTotal = 0;
  var techAnswers = 0;
  var noTechTotal = 0;
  var noTechAnswers = 0;
  for (var answer = 0; answer < evaluation.answers.length; answer++) {
    if (evaluation.answers[answer]._doc.question.tech === true) {
      techTotal++;
      if (evaluation.answers[answer]._doc.answer &&
        evaluation.answers[answer]._doc.answer.value !== undefined) {
        techAnswers++;
      }
    } else {
      noTechTotal++;
      if (evaluation.answers[answer]._doc.answer &&
        evaluation.answers[answer]._doc.answer.value !== undefined) {
        noTechAnswers++;
      }
    }
  }
  if (techTotal === techAnswers) { //pure tech evaluation
    return true;
  } else if (noTechTotal === noTechAnswers) { //pure non-tech evaluation
    return true;
  }
  return false;
}

function getQuestionAnserUUID(question, answerValue) {
  for (var v in question.values) {
    if (question.values[v].value === answerValue) {
      return question.values[v]._doc._id;
    }
  }
}
function totalScore(structure, totalAnsers) {
  var totalS = 0;
  for (var questionAnswerUuid in structure) {
    totalS += structure[questionAnswerUuid] / totalAnsers;
  }
  return totalS;
}

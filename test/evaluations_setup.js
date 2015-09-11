var Evaluation = require('../models/schema/evaluation.js');
var User       = require('../models/schema/user.js');
var Promise    = require('promise');
var moment     = require('moment');
var fs         = require('fs');
var cs         = require('./common_setup.js');

/**
 * Sets up the Questionnaire collection by removing all entries that might be left over from
 * the last unit test run.
 * @param {function} done - callback
 */
var setup = function(done) {
  Evaluation.remove({}, cs.errorHandlerWrapper(function() {
    User.remove({}, cs.errorHandlerWrapper(done));
  }));
};

var teardown = function(done) {
  done();
};

/**
 * Loads scenarios from the data/evaluations/ subdirectory.
 * @param {Number[]} evaluationsToLoad - array of names of evaluations to load
 * @return {object[]} - an array containing objects
 */
var loadEvaluations = function(evaluationsToLoad) {
  return evaluationsToLoad
    .map(function(n)  { return __dirname + '/data/evaluations/' + n + '.json'; })
    .map(function(fn) { return JSON.parse(fs.readFileSync(fn)); });
};

/**
 * Inserts evaluation documents into the Evaluation collection.
 * @param {object[]} evaluations - array of evaluation objects
 * @return {Promise} promise that get's resolved (empty content) when inserted successfully or rejected (on error)
 */
var insertEvaluations = function(evaluations) {
  return new Promise(function(resolve, reject) {
    var evaluationModels = evaluations.map(function(evaluation) {
      return new Evaluation(evaluation);
    });
    cs.saveModels(evaluationModels, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  setup             : setup,
  teardown          : teardown,
  loadUsers         : cs.loadUsers,
  insertUsers       : cs.insertUsers,
  loadEvaluations   : loadEvaluations,
  insertEvaluations : insertEvaluations
};

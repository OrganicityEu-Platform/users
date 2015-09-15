var Questionnaire = require('../models/schema/questionnaire.js');
var Question      = require('../models/schema/question.js');
var Promise       = require('promise');
var moment        = require('moment');
var fs            = require('fs');
var cs            = require('./common_setup.js');

/**
 * Sets up the Questionnaire collection by removing all entries that might be left over from
 * the last unit test run.
 * @param {function} done - callback
 */
var setup = function(done) {
  Questionnaire.remove({}, done);
};

var teardown = function(done) {
  done();
};

/**
 * Loads scenarios from the data/questionnaire/ subdirectory.
 * @param {Number[]} versionsToLoad - array of Numbers representing the versions to load
 * @return {object[]} - an array containing Questionnaire objects
 */
var loadQuestionnaires = function(versionsToLoad) {
  return versionsToLoad
    .map(function(v)  { return __dirname + '/data/questionnaire/version_' + v + '.json'; })
    .map(function(fn) { return JSON.parse(fs.readFileSync(fn)); });
};

/**
 * Inserts questionnaire documents into the questionnaire collection.
 * @param {object[]} questionnaires - array of questionnaire objects
 * @return {Promise} promise that get's resolved (empty content) when inserted successfully or rejected (on error)
 */
var insertQuestionnaires = function(questionnaires) {
  return new Promise(function(resolve, reject) {
    var questionnaireModels = questionnaires.map(function(questionnaire) {
      return new Questionnaire(questionnaire);
    });
    cs.saveModels(questionnaireModels, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  setup                : setup,
  teardown             : teardown,
  loadQuestionnaires   : loadQuestionnaires,
  insertQuestionnaires : insertQuestionnaires
};

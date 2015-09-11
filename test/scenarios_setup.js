var fs       = require('fs');
var Scenario = require('../models/scenario.js');
var User     = require('../models/userSchema.js');
var Promise  = require('promise');
var moment   = require('moment');
var cs       = require('./common_setup.js');

/**
 * Sets up the Scenario and User collections by removing all entries that might be left over from
 * the last unit test run.
 * @param {function} done - callback
 */
var setup = function(done) {
  Scenario.remove({}, cs.errorHandlerWrapper(function() {
    User.remove({}, cs.errorHandlerWrapper(done));
  }));
};

var teardown = function(done) {
  done();
};

/**
 * Loads scenarios from the data/scenarios/ subdirectory.
 * @param {object[]} toLoad - array of objects, each containing the uuid and the version 'v' of the scenario to insert
 * @return {object[]} - an array containing scenario objects
 */
var loadScenarios = function(toLoad) {
  return toLoad
    .map(function(tl) { return __dirname + '/data/scenarios/' + tl.uuid + '_' + tl.v + '.json'; })
    .map(function(fn) { return JSON.parse(fs.readFileSync(fn)); });
};

/**
 * Inserts a set of scenario objects into the scenarios collection.
 * @param {object[]} scenarios - array of scenario objects to be inserted
 * @return {Promise} promise that get's resolved (empty content) when inserted successfully or rejected (on error)
 */
var insertScenarios = function(scenarios) {
  var promise = new Promise(function(resolve, reject) {
    var lastTimestamp = moment();
    var timestampedScenarios = scenarios
      .map(function(scenario) {
        // make sure scenario timestamp are one minute apart so they differ (important for e.g., timestamp sorting)
        lastTimestamp = moment(lastTimestamp).add(1, 'seconds');
        scenario.timestamp = lastTimestamp.toDate();
        return scenario;
      })
      .map(function(scenario) {
        return new Scenario(scenario);
      });
    cs.saveModels(timestampedScenarios, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  return promise;
};

var scenarioFields       = [
  'uuid', 'version', 'creator',
  'title', 'summary', 'narrative', 'dataSources', 'actors', 'sectors', 'devices'
];

var scenarioUpdateFields = ['title', 'summary', 'narrative', 'actors', 'sectors', 'devices', 'dataSources'];

var cloneConstrained = function(scenario) {
  var clone = {};
  scenarioUpdateFields.forEach(function(field) {
    clone[field] = scenario[field];
  });
  return clone;
};

module.exports = {
  setup                : setup,
  teardown             : teardown,
  insertScenarios      : insertScenarios,
  loadScenarios        : loadScenarios,
  loadUsers            : cs.loadUsers,
  insertUsers          : cs.insertUsers,
  scenarioFields       : scenarioFields,
  scenarioUpdateFields : scenarioUpdateFields,
  cloneConstrained     : cloneConstrained
};

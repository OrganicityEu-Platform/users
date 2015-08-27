var fs       = require('fs');
var Scenario = require('../models/scenario.js');
var User     = require('../models/userSchema.js');
var Promise  = require('promise');

var errorHandlerWrapper = function(success) {
  return function(err) {
    if (err) {
      done(err);
      console.log(err.stack);
      return;
    }
    success();
  };
};

var saveModels = function(models, done) {
  if (models.length === 0) {
    done();
    return;
  }
  models[0].save(function(err, saved) {
    if (err) {
      done(err);
      return;
    }
    saveModels(models.slice(1), done);
  });
};

var readJsonFiles = function(dir) {
  var files = fs.readdirSync(dir);
  var docs = [];
  files.forEach(function(file) {
    docs.push(JSON.parse(fs.readFileSync(dir + file)));
  });
  return docs;
};

var readJsonFilesFromDir = function(dir) {
  var files = fs.readdirSync(dir);
  var docs = [];
  files.forEach(function(file) {
    docs.push(JSON.parse(fs.readFileSync(dir + file)));
  });
  return docs;
};

/**
 * Reads a set of Json documents
 * @param {string[]} fileArr - an array of file names
 * @return {object[]} - the JavaScript objects containing the Json read from the disk
 */
var readJsonFiles = function(fileArr) {
  return fileArr.map(function(file) {
    return JSON.parse(fs.readFileSync(file));
  });
};

/**
 * Sets up the Scenario and User collections by removing all entries that might be left over from
 * the last unit test run.
 * @param {function} done - callback
 */
var setup = function(done) {
  Scenario.remove({}, errorHandlerWrapper(function() {
    User.remove({}, errorHandlerWrapper(done));
  }));
};

var teardown = function(done) {
  done();
};

var loadScenarios = function(toLoad) {
  return toLoad
    .map(function(tl) { return __dirname + '/data/scenarios/' + tl.uuid + '_' + tl.v + '.json'; })
    .map(function(fn) { return JSON.parse(fs.readFileSync(fn)); });
};

/**
 * Inserts a set of scenario objects into the scenarios collection.
 * @param {object[]} scenarios - array of scenario objects to be inserted
 * @return {Promise} promise that get's resolved (empty content) when or rejected (on error)
 */
var insertScenarios = function(scenarios) {
  var promise = new Promise(function(resolve, reject) {
    saveModels(scenarios.map(function(scenario) { return new Scenario(scenario); }), function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  return promise;
};

module.exports = {
  setup : setup,
  teardown : teardown,
  insertScenarios : insertScenarios,
  loadScenarios : loadScenarios
};

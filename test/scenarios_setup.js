var fs       = require('fs');
var Scenario = require('../models/scenario.js');
var User     = require('../models/userSchema.js');

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

var fillUsersCollection = function(done) {
  var userDir = __dirname + '/data/users/';
  var users = readJsonFilesFromDir(userDir).map(function(json) { return new User(json); });
  saveModels(users, done);
};

var fillScenariosCollection = function(done) {
  var scenarioDir = __dirname + '/data/scenarios/';
  var scenarios = readJsonFilesFromDir(scenarioDir).map(function(json) { return new Scenario(json); });
  saveModels(scenarios, done);
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

var fillCollections = function(done) {
  fillUsersCollection(function(err) {
    if (err) {
      done(err);
      return;
    }
    fillScenariosCollection(done);
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
 * @param {function} callback - called when done
 */
var insertScenarios = function(scenarios, done) {
  if (scenarios.length === 0) {
    done();
  }
  new Scenario(scenarios[0]).save(function(err) {
    if (err) {
      done(err);
      return;
    }
    insertScenarios(scenarios.slice(1), done);
  });
};

module.exports = {
  setup : setup,
  teardown : teardown,
  insertScenarios : insertScenarios,
  loadScenarios : loadScenarios
};

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

/**
 * Inserts a set of scenarios from the folder ./data/scenarios with the given UUID into the
 * scenarios collection. File naming schema must follow UUID_VERSION.json. Each argument is a hash
 * @param {object[]} toBeInserted - array of {uuid:'...', v:'...'} objects to be inserted
 * @param {function} callback - called when done
 */
var insertScenarios = function(toBeInserted, done) {
  if (toBeInserted.length === 0) {
    done();
  }
  var scenarioDir = __dirname + '/data/scenarios/';
  var filename = scenarioDir + toBeInserted[0].uuid + '_' + toBeInserted[0].v + '.json';
  var scenario = JSON.parse(fs.readFileSync(filename));
  new Scenario(scenario).save(function(err) {
    if (err) {
      done(err);
      return;
    }
    insertScenarios(toBeInserted.slice(1), done);
  });
};

module.exports = {
  setup : setup,
  teardown : teardown,
  insertScenarios : insertScenarios
};

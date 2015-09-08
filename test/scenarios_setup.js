var fs       = require('fs');
var Scenario = require('../models/scenario.js');
var User     = require('../models/userSchema.js');
var Promise  = require('promise');
var moment   = require('moment');

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
 * Loads users from the data/users/ subdirectory.
 * @param {string[]} usersToLoad - array of user UUID, corresponding to filenames in data/users subdirectory
 * @return {object[]} - an array containing user objects
 */
var loadUsers = function(usersToLoad) {
  return usersToLoad
    .map(function(user) { return __dirname + '/data/users/' + user + '.json'; })
    .map(function(fn) { return JSON.parse(fs.readFileSync(fn)); });
};

/**
 * Inserts user documents into the users collection.
 * @param {object[]} users - array of user objects
 * @return {Promise} promise that get's resolved (empty content) when inserted successfully or rejected (on error)
 */
var insertUsers = function(users) {
  return new Promise(function(resolve, reject) {
    var userModels = users.map(function(user) {
      return new User(user);
    });
    saveModels(userModels, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
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
    saveModels(timestampedScenarios, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  return promise;
};

var scenarioUpdateFields = ['title', 'summary', 'narrative', 'actors', 'sectors', 'devices', 'dataSources'];

var cloneConstrained = function(scenario) {
  var clone = {};
  scenarioUpdateFields.forEach(function(field) {
    clone[field] = scenario[field];
  });
  return clone;
};

module.exports = {
  setup : setup,
  teardown : teardown,
  insertScenarios : insertScenarios,
  loadScenarios : loadScenarios,
  loadUsers : loadUsers,
  insertUsers : insertUsers,
  scenarioUpdateFields : scenarioUpdateFields,
  cloneConstrained : cloneConstrained
};

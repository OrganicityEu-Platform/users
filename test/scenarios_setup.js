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
  var users = readJsonFiles(userDir).map(function(json) { return new User(json); });
  saveModels(users, done);
};

var fillScenariosCollection = function(done) {
  var scenarioDir = __dirname + '/data/scenarios/';
  var scenarios = readJsonFiles(scenarioDir).map(function(json) { return new Scenario(json); });
  saveModels(scenarios, done);
};

var readJsonFiles = function(dir) {
  var files = fs.readdirSync(dir);
  var docs = [];
  files.forEach(function(file) {
    docs.push(JSON.parse(fs.readFileSync(dir + file)));
  });
  return docs;
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

var setup = function(done) {

  Scenario.remove({}, errorHandlerWrapper(function() {
    //console.log('Removed all scenarios');

    User.remove({}, errorHandlerWrapper(function() {
      //console.log('Removed all users');

      fillCollections(function() {
        //console.log('Filled test collections with test data');

        done();
      });
    }));
  }));
};

var teardown = function(done) {
  done();
};

module.exports = {
  setup : setup,
  teardown : teardown
};

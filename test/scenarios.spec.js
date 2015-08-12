var fs       = require('fs');
var mongoose = require('mongoose');
var configDB = require('../config/database.js');
var Scenario = require('../models/scenario.js');
var Scenario = require('../models/userSchema.js');

var saveModels = function(models, done) {
  if (scenarios.length == 0) {
    done();
    return;
  }
  models[0].save().then(function() {
    saveModels(models.slice(1), done);
  });
};

var fillUsersCollection = function(done) {
  // TODO actually fill with users
  done();
};

var fillScenariosCollection = function(done) {
  var scenarioDir = __dirname + '/data/scenarios/';
  var files = fs.readdirSync(scenarioDir);
  var scenarios = [];
  files.forEach(function(file) {
    scenarios.push(new Scenario(JSON.parse(fs.readFileSync(scenarioDir + file))));
  });
  saveModels(scenarios, done);
};

var fillCollections = function(done) {
  fillUsersCollection(function() {
    fillScenariosCollection(done);
  });
};

var createCollections = function(done) {
  mongoose.connection.db.createCollection('users', function(err) {
    if (err) {
      done(err);
      return;
    }
    mongoose.connection.db.createCollection('scenarios', function(err) {
      if (err) {
        done(err);
        return;
      }
      done();
    });
  });
};

var dropCollections = function(done) {
  mongoose.connection.db.dropCollection('scenarios', function(err) {
    if (err) {
      done(err);
      return;
    }
    mongoose.connection.db.dropCollection('users', function(err) {
      if (err) {
        done(err);
        return;
      }
      done();
    });
  });
};

describe('first test suite', function() {

  beforeEach(function(done) {

    mongoose.connect(configDB.test_url, function() {
      console.log('Connected to MongoDB');

      dropCollections(function() {
        console.log('Dropped test collections');

        createCollections(function() {
          console.log('Created test collections');

          fillCollections(function() {
            console.log('Filled test collections with test data');

            Scenario.find().stream()
              .on('data', console.log)
              .on('close', done);
          });
        });
      });
    });
  });

  afterEach(function(done) {
    mongoose.disconnect(function() {
      console.log('Disconnected from MongoDB');
      done();
    });
  });

  it('2 should equal 2', function() {
    expect('2').toBe('2');
  });

  it('1 should not equal 2', function() {
    expect('1').not.toBe('2');
  });

  it('2 should not equal 3', function() {
    expect('2').not.toBe('3');
  });
});

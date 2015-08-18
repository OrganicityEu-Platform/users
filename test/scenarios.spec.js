var mongoose = require('mongoose');
var configDB = require('../config/database.js');
var Scenario = require('../models/scenario.js');
var User     = require('../models/userSchema.js');
var ss       = require('./scenarios_setup.js');

describe('When querying a scenario, the API', function() {

  beforeEach(function(done) {
    mongoose.connect(configDB.test_url);
    ss.setup(function() {
      done();
    });
  });

  afterEach(function(done) {
    ss.teardown(done);
    mongoose.connection.close();
  });

  xit('should return only latest versions when asking for all latest versions', function() {
    //ss.insert({uuid:'uuid1', version:'v1'}, ...)
  });

  xit('should return scenarios in correct ascending order if sorted by title', function() {

  });

  xit('should return scenarios in correct descending order if sorted by title descending', function() {

  });

  xit('should return scenarios in correct ascending order if sorted by timestamp', function() {

  });

  xit('should return scenarios in correct descending order if sorted by timestamp descending', function() {

  });

  xit('should return only scenarios that include a given term when doing a term search', function() {

  });

  xit('should return only scenarios with the given actor tag', function() {

  });

  xit('should return only scenarios that have all the given actor tags', function() {

  });

  xit('should return only scenarios with the given sector tag', function() {

  });

  xit('should return only scenarios that have all the given sector tags', function() {

  });

  xit('should return only scenarios with the given device tag', function() {

  });

  xit('should return only scenarios that have all the given device tags', function() {

  });

  xit('should return only scenario by a given user', function() {

  });

  xit('should return only the latest version of a scenario when retrieving by UUID', function() {

  });

  xit('should return 404 not found if scenario with the given UUID does not exist', function() {

  });

  xit('should return the scenario with UUID if it exists', function() {

  });

});

describe('When creating a scenario, the API', function() {

  beforeEach(function(done) {
    ss.setup(function() {
      done();
    });
  });

  afterEach(function(done) {
    ss.teardown(done);
  });

  xit('should check if a scenario with same version and UUID already exists', function() {

  });

  xit('should only allow setting fields that are defined in the ScenarioUpdate type', function() {

  });

  xit('should not allow if the user is not logged in', function() {

  });

  xit('should have the logged in users UUID as creator in the returned document', function() {

  });

  xit('should return 400 bad request if a non-existing data source was linked in the scenario', function() {

  });

});

describe('When updating a scenario, the API', function() {

  beforeEach(function(done) {
    ss.setup(function() {
      done();
    });
  });

  afterEach(function(done) {
    ss.teardown(done);
  });

  xit('should only allow setting fields that are defined in the ScenarioUpdate type', function() {

  });

  xit('should return the newly created scenario document with a version incremented by one', function() {

  });

  xit('should check if the UUID in the document equals the UUID in the URL', function() {

  });

  xit('should return 401 if the user is not logged in', function() {

  });

  xit('should return 404 not found if scenario with URL param UUID does not exist', function() {

  });

  xit('should return 403 forbidden if non-administrator, non-moderator user is not creator', function() {

  });

  xit('should allow if user is creator', function() {

  });

  xit('should allow if user is administrator', function() {

  });

  xit('should allow if user is moderator', function() {

  });

  xit('should return 400 bad request if a non-existing data source was linked in the scenario', function() {

  });

});

describe('When deleting a scenario (version), the API', function() {

  beforeEach(function(done) {
    ss.setup(function() {
      done();
    });
  });

  afterEach(function(done) {
    ss.teardown(done);
  });

  xit('should return 404 not found if scenario with UUID does not exist', function() {

  });

  xit('should return 404 not found if scenario with UUID does exist but not the given version', function() {

  });

  xit('should return 403 forbidden if non-administrator, non-moderator user is not creator', function() {

  });

  xit('should return 401 if the user is not logged in', function() {

  });

  xit('should return 204 if the scenario version was succesfully deleted', function() {

  });
});

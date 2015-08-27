var $        = require('jquery');
var mongoose = require('mongoose');
var configDB = require('../config/database.js');
var Scenario = require('../models/scenario.js');
var User     = require('../models/userSchema.js');
var ss       = require('./scenarios_setup.js');
var api      = require('../api_routes.js');
var config   = require('../config/config.js');
//var spawn    = require('child_process').spawn;
var request = require('supertest');
var expect = require('expect.js');

var serverPort = process.env.PORT || config.port;
var serverApp   = require('../server.js');
var server;
var notToBeCalled = function() {};

describe('When querying a scenario, the API', function() {

  beforeEach(function(done) {
    if (!mongoose.connection.db) {
      mongoose.connect(configDB.test_url);
    }
    ss.setup(function(err) {
      if (err) {
        done(err);
        return;
      }
      server = serverApp.start(function(err) {
        if (err) {
          done(err);
          return;
        }
        console.log('server started');
        done();
      });
    });
  });

  afterEach(function(done) {
    if (server) {
      serverApp.stop(function(err) {
        if (err) {
          done(err);
          return;
        }
        console.log('server stopped');
        mongoose.connection.close();
        done();
      });
    }
  });

  it('should return only latest versions when asking for all latest versions', function(done) {

    var scenarios = ss.loadScenarios([
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'agingpop', v: 'v2'},
      {uuid: 'parkpred', v: 'v1'},
      {uuid: 'parkpred', v: 'v2'},
      {uuid: 'parkpred', v: 'v3'}
    ]);

    var execTest = request(server)
      .get(api.route('scenario_list'))
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function(res) {
        expect(res.body.length).to.be(2);
        expect(res.body[0]).to.eql(scenarios[1]);
        expect(res.body[1]).to.eql(scenarios[2]);
      })
      .end(done);

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it.skip('should return scenarios in correct ascending order if sorted by title', function() {

  });

  it.skip('should return scenarios in correct descending order if sorted by title descending', function() {

  });

  it.skip('should return scenarios in correct ascending order if sorted by timestamp', function() {

  });

  it.skip('should return scenarios in correct descending order if sorted by timestamp descending', function() {

  });

  it.skip('should return only scenarios that include a given term when doing a term search', function() {

  });

  it.skip('should return only scenarios with the given actor tag', function() {

  });

  it.skip('should return only scenarios that have all the given actor tags', function() {

  });

  it.skip('should return only scenarios with the given sector tag', function() {

  });

  it.skip('should return only scenarios that have all the given sector tags', function() {

  });

  it.skip('should return only scenarios with the given device tag', function() {

  });

  it.skip('should return only scenarios that have all the given device tags', function() {

  });

  it.skip('should return only scenario by a given user', function() {

  });

  it.skip('should return only the latest version of a scenario when retrieving by UUID', function() {

  });

  it.skip('should return 404 not found if scenario with the given UUID does not exist', function() {

  });

  it.skip('should return the scenario with UUID if it exists', function() {

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

  it.skip('should check if a scenario with same version and UUID already exists', function() {

  });

  it.skip('should only allow setting fields that are defined in the ScenarioUpdate type', function() {

  });

  it.skip('should not allow if the user is not logged in', function() {

  });

  it.skip('should have the logged in users UUID as creator in the returned document', function() {

  });

  it.skip('should return 400 bad request if a non-existing data source was linked in the scenario', function() {

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

  it.skip('should only allow setting fields that are defined in the ScenarioUpdate type', function() {

  });

  it.skip('should return the newly created scenario document with a version incremented by one', function() {

  });

  it.skip('should check if the UUID in the document equals the UUID in the URL', function() {

  });

  it.skip('should return 401 if the user is not logged in', function() {

  });

  it.skip('should return 404 not found if scenario with URL param UUID does not exist', function() {

  });

  it.skip('should return 403 forbidden if non-administrator, non-moderator user is not creator', function() {

  });

  it.skip('should allow if user is creator', function() {

  });

  it.skip('should allow if user is administrator', function() {

  });

  it.skip('should allow if user is moderator', function() {

  });

  it.skip('should return 400 bad request if a non-existing data source was linked in the scenario', function() {

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

  it.skip('should return 404 not found if scenario with UUID does not exist', function() {

  });

  it.skip('should return 404 not found if scenario with UUID does exist but not the given version', function() {

  });

  it.skip('should return 403 forbidden if non-administrator, non-moderator user is not creator', function() {

  });

  it.skip('should return 401 if the user is not logged in', function() {

  });

  it.skip('should return 204 if the scenario version was succesfully deleted', function() {

  });
});

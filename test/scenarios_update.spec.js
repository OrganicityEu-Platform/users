process.env.NODE_ENV = 'test';

var mongoose                = require('mongoose');
var request                 = require('supertest');
var expect                  = require('expect.js');
var moment                  = require('moment');

var configDB                = require('../config/database.js');
var Scenario                = require('../models/schema/scenario.js');
var User                    = require('../models/schema/user.js');
var api                     = require('../api_routes.js');
var config                  = require('../config/config.js');
var serverApp               = require('../server.js');
var http                    = require('http-status');

var ss                      = require('./scenarios_setup.js');

var scenarios_common_tests  = require('./scenarios_common_tests.js');

var server;

describe('When updating a scenario, the API', function() {

  var users;
  var scenarios;

  var user;
  var url;

  beforeEach(function(done) {
    users = ss.loadUsers(['daniel', 'leinad', 'daniel_admin', 'leinad_moderator']);
    scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);
    user = undefined;
    url = undefined;
    mongoose.connect(configDB.test_url);
    ss.setup(function(err) {
      if (err) {
        done(err);
        return;
      }
      server = serverApp.start(done);
    });
  });

  afterEach(function(done) {
    if (server) {
      serverApp.stop(done);
    }
    mongoose.connection.close();
  });

  /*
   * Helper method to simplyfy the tests
   */
  var inputValidationTestHelper = function(scenario, code, done, expect) {

    var testUrl = url || api.reverse('scenario_by_uuid', { uuid : 'agingpop' });
    var testUser = user || users[0];

    var execTest = function() {
      request(server)
        .put(testUrl)
        .send(scenario)
        .set('Content-type', 'application/json')
        .auth(testUser.local.email, testUser.local.__passwordplain) // log in with user 'daniel'
        .expect(code)
        .expect(expect || function() {})
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertScenarios(scenarios)).catch(done).then(execTest);
  };

  // Include common tests
  scenarios_common_tests(function() {
    return server;
  }, function() {
    return users;
  }, inputValidationTestHelper, ss);

  it('should return the newly created scenario document with a version incremented by one', function(done) {
    var scenario = ss.cloneConstrained(scenarios[0]);
    inputValidationTestHelper(scenario, http.CREATED, done, function(res) {
      expect(res.body.version).to.eql(scenarios[0].version + 1);
      expect(res.headers.location).to.be.ok();
    });
  });

  it('should return 404 not found if scenario with URL param UUID does not exist', function(done) {
    url = api.reverse('scenario_by_uuid', { uuid : 'unknownuuid' });

    var scenario = ss.cloneConstrained(scenarios[0]);
    inputValidationTestHelper(scenario, http.NOT_FOUND, done);
  });

  it('should allow if user is creator', function(done) {

    user = users[0]; // daniel
    url = api.reverse('scenario_by_uuid', { uuid : scenarios[0].uuid });

    var scenario = ss.cloneConstrained(scenarios[0]);
    scenario.title = 'Updated title';
    inputValidationTestHelper(scenario, http.CREATED, done, function(res) {
      expect(res.body.creator).to.eql(user.uuid);
    });
  });

  it('should return 403 forbidden if non-administrator, non-moderator user is not creator', function(done) {
    user = users[1]; // leinad
    url = api.reverse('scenario_by_uuid', { uuid : scenarios[0].uuid });

    var scenario = ss.cloneConstrained(scenarios[0]);
    inputValidationTestHelper(scenario, http.FORBIDDEN, done);
  });

  it('should allow if user is administrator and update creator field accordingly', function(done) {

    url = api.reverse('scenario_by_uuid', { uuid : scenarios[0].uuid });
    user = users[2]; // daniel_admin

    var scenario = ss.cloneConstrained(scenarios[0]);
    scenario.title = 'Updated title';
    inputValidationTestHelper(scenario, http.CREATED, done, function(res) {
      expect(res.body.creator).to.eql(user.uuid);
    });
  });

  it('should allow if user is moderator and update creator field accordingly2', function(done) {

    url = api.reverse('scenario_by_uuid', { uuid : scenarios[0].uuid });
    user = users[3]; // leinad_moderator

    var scenario = ss.cloneConstrained(scenarios[0]);
    scenario.title = 'Updated title';
    inputValidationTestHelper(scenario, http.CREATED, done, function(res) {
      expect(res.body.creator).to.eql(users[3].uuid);
    });
  });

  it.skip('should return 400 BAD_REQUEST if a non-existing data source was linked in the scenario', function(done) {

  });

});

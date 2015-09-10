process.env.NODE_ENV = 'test';

var mongoose  = require('mongoose');
var request   = require('supertest');
var expect    = require('expect.js');

var configDB  = require('../config/database.js');
var Scenario  = require('../models/scenario.js');
var User      = require('../models/userSchema.js');
var api       = require('../api_routes.js');
var config    = require('../config/config.js');
var serverApp = require('../server.js');
var http      = require('http-status');

var ss        = require('./scenarios_setup.js');

var server;

describe('When deleting a scenario (version), the API', function() {

  beforeEach(function(done) {
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

  it('should return 401 if the user is not logged in', function(done) {
    request(server)
      .delete(api.reverse('scenario_by_uuid', { uuid : 'agingpop' }))
      .expect(http.UNAUTHORIZED)
      .end(done);
  });

  it('should return 204 if the scenario version was succesfully deleted', function(done) {
    var users = ss.loadUsers(['daniel','leinad']);
    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);
    var execTest = function() {
      request(server)
        .delete(api.reverse('scenario_by_uuid', { uuid : 'agingpop' }))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .expect(http.NO_CONTENT)
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertScenarios(scenarios)).catch(done).then(execTest);
  });

  it('should return 200 OK and the earlier existing version if there is still one left', function(done) {
    var users = ss.loadUsers(['daniel','leinad']);
    var scenarios = ss.loadScenarios([
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'agingpop', v: 'v2'}
    ]);
    var execTest = function() {
      request(server)
        .delete(api.reverse('scenario_by_uuid', { uuid : 'agingpop' }))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .expect(http.OK)
        .expect(function(res) {
          ss.scenarioFields.forEach(function(field) {
            expect(res.body[field]).to.eql(scenarios[0][field]);
          });
        })
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertScenarios(scenarios)).catch(done).then(execTest);
  });

  it.skip('should return 204 NO CONTENT if deleting the last remaining version', function(done) {

  });

  it('should return 404 not found if scenario with UUID does not exist', function(done) {
    var users = ss.loadUsers(['daniel','leinad']);
    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);
    var execTest = function() {
      request(server)
        .delete(api.reverse('scenario_by_uuid', { uuid : 'nonexisting' }))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .expect(http.NOT_FOUND)
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertScenarios(scenarios)).catch(done).then(execTest);
  });

  it('should return 403 forbidden if non-administrator, non-moderator user is not creator', function(done) {
    var users = ss.loadUsers(['daniel','leinad']);
    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);
    var execTest = function() {
      request(server)
        .delete(api.reverse('scenario_by_uuid', { uuid : 'agingpop' }))
        .auth(users[1].local.email, users[1].local.__passwordplain)
        .expect(http.FORBIDDEN)
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertScenarios(scenarios)).catch(done).then(execTest);
  });
});

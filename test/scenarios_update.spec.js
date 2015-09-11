process.env.NODE_ENV = 'test';

var mongoose  = require('mongoose');
var request   = require('supertest');
var expect    = require('expect.js');

var configDB  = require('../config/database.js');
var Scenario  = require('../models/schema/scenario.js');
var User      = require('../models/schema/user.js');
var api       = require('../api_routes.js');
var config    = require('../config/config.js');
var serverApp = require('../server.js');
var http      = require('http-status');

var ss        = require('./scenarios_setup.js');

var server;

describe('When updating a scenario, the API', function() {

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

  it('should not allow setting uuid field', function(done) {
    var users = ss.loadUsers(['daniel']);
    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);
    var execTest = function() {
      var req = ss.cloneConstrained(scenarios[0]);
      req.uuid = 'someuuid';
      request(server)
        .put(api.reverse('scenario_by_uuid', { uuid : 'agingpop' }))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .send(req)
        .set('Accept', 'application/json')
        .expect(http.BAD_REQUEST)
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertScenarios(scenarios)).catch(done).then(execTest);
  });

  it('should not allow setting creator field', function(done) {
    var users = ss.loadUsers(['daniel']);
    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);
    var execTest = function() {
      var req = ss.cloneConstrained(scenarios[0]);
      req.creator = 'unknownme';
      request(server)
        .put(api.reverse('scenario_by_uuid', { uuid : 'agingpop' }))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .send(req)
        .expect(http.BAD_REQUEST)
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertScenarios(scenarios)).catch(done).then(execTest);
  });

  it('should not allow setting version field', function(done) {
    var users = ss.loadUsers(['daniel']);
    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);
    var execTest = function() {
      var req = ss.cloneConstrained(scenarios[0]);
      req.version = 3;
      request(server)
        .put(api.reverse('scenario_by_uuid', { uuid : 'agingpop' }))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .send(req)
        .expect(http.BAD_REQUEST)
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertScenarios(scenarios)).catch(done).then(execTest);
  });

  it('should not allow setting timestamp field', function(done) {
    var users = ss.loadUsers(['daniel']);
    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);
    var execTest = function() {
      var req = ss.cloneConstrained(scenarios[0]);
      req.timestamp = new Date().toISOString();
      request(server)
        .put(api.reverse('scenario_by_uuid', { uuid : 'agingpop' }))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .send(req)
        .expect(http.BAD_REQUEST)
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertScenarios(scenarios)).catch(done).then(execTest);
  });

  it('should return the newly created scenario document with a version incremented by one', function(done) {
    var users = ss.loadUsers(['daniel']);
    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);
    var execTest = function() {
      var req = ss.cloneConstrained(scenarios[0]);
      request(server)
        .put(api.reverse('scenario_by_uuid', { uuid : 'agingpop' }))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .send(req)
        .expect(http.CREATED)
        .expect(function(res) {
          expect(res.body.version).to.eql(scenarios[0].version + 1);
          expect(res.headers.location).to.be.ok();
        })
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertScenarios(scenarios)).catch(done).then(execTest);
  });

  it('should return 401 if the user is not logged in', function(done) {
    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);
    var execTest = function() {
      var req = ss.cloneConstrained(scenarios[0]);
      request(server)
        .put(api.reverse('scenario_by_uuid', { uuid : 'agingpop' }))
        .send(req)
        .expect(http.UNAUTHORIZED)
        .end(done);
    };
    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should return 404 not found if scenario with URL param UUID does not exist', function(done) {
    var users = ss.loadUsers(['daniel']);
    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);
    var execTest = function() {
      var req = ss.cloneConstrained(scenarios[0]);
      request(server)
        .put(api.reverse('scenario_by_uuid', { uuid : 'unknownuuid' }))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .send(req)
        .expect(http.NOT_FOUND)
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertScenarios(scenarios)).catch(done).then(execTest);
  });

  it('should return 403 forbidden if non-administrator, non-moderator user is not creator', function(done) {
    var users = ss.loadUsers(['daniel', 'leinad']);
    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);
    var execTest = function() {
      var req = ss.cloneConstrained(scenarios[0]);
      var url = api.reverse('scenario_by_uuid', { uuid : scenarios[0].uuid });
      request(server)
        .put(url)
        .auth(users[1].local.email, users[1].local.__passwordplain)
        .send(req)
        .expect(http.FORBIDDEN)
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertScenarios(scenarios)).catch(done).then(execTest);
  });

  it('should allow if user is creator', function(done) {
    var users = ss.loadUsers(['daniel', 'leinad']);
    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);
    var execTest = function() {
      var req = ss.cloneConstrained(scenarios[0]);
      req.title = 'Updated title';
      request(server)
        .put(api.reverse('scenario_by_uuid', { uuid : scenarios[0].uuid }))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .send(req)
        .expect(http.CREATED)
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertScenarios(scenarios)).catch(done).then(execTest);
  });

  it('should allow if user is administrator and update creator field accordingly', function(done) {
    var users = ss.loadUsers(['daniel', 'daniel_admin']);
    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);
    var execTest = function() {
      var req = ss.cloneConstrained(scenarios[0]);
      req.title = 'Updated title';
      request(server)
        .put(api.reverse('scenario_by_uuid', { uuid : scenarios[0].uuid }))
        .auth(users[1].local.email, users[1].local.__passwordplain)
        .send(req)
        .expect(http.CREATED)
        .expect(function(res) {
          expect(res.body.creator).to.eql(users[1].uuid);
        })
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertScenarios(scenarios)).catch(done).then(execTest);
  });

  it('should allow if user is moderator and update creator field accordingly', function(done) {
    var users = ss.loadUsers(['daniel', 'leinad_moderator']);
    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);
    var execTest = function() {
      var req = ss.cloneConstrained(scenarios[0]);
      req.title = 'Updated title';
      request(server)
        .put(api.reverse('scenario_by_uuid', { uuid : scenarios[0].uuid }))
        .auth(users[1].local.email, users[1].local.__passwordplain)
        .send(req)
        .expect(http.CREATED)
        .expect(function(res) {
          expect(res.body.creator).to.eql(users[1].uuid);
        })
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertScenarios(scenarios)).catch(done).then(execTest);
  });

  it.skip('should return 400 BAD_REQUEST if a non-existing data source was linked in the scenario', function(done) {

  });

});

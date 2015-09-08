process.env.NODE_ENV = 'test';

var mongoose  = require('mongoose');
var request   = require('supertest');
var expect    = require('expect.js');
var moment    = require('moment');

var configDB  = require('../config/database.js');
var Scenario  = require('../models/scenario.js');
var User      = require('../models/userSchema.js');
var api       = require('../api_routes.js');
var config    = require('../config/config.js');
var serverApp = require('../server.js');
var http      = require('http-status');

var ss        = require('./scenarios_setup.js');

var server;

describe('When creating a scenario, the API', function() {

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
    mongoose.connection.close();
    if (server) {
      serverApp.stop(done);
    }
  });

  it('should return 401 Unauthorized if the user is not logged in', function(done) {
    var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}])[0];
    request(server)
      .post(api.reverse('scenario_list'))
      .send(scenario)
      .set('Content-type', 'application/json')
      .expect(http.UNAUTHORIZED)
      .end(done);
  });

  it('should return 400 BAD_REQUEST when trying to set uuid field', function(done) {
    var users = ss.loadUsers(['daniel','leinad']);
    var execTest = function() {
      var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}])[0]; // uuid already set
      request(server)
        .post(api.reverse('scenario_list'))
        .send(scenario)
        .set('Content-type', 'application/json')
        .auth(users[0].local.email, 'leinad') // log in with user 'daniel'
        .expect(http.BAD_REQUEST)
        .end(done);
    };
    ss.insertUsers(users).catch(done).then(execTest);
  });

  it('should return 400 BAD_REQUEST when trying to set creator field', function(done) {
    var users = ss.loadUsers(['daniel','leinad']);
    var execTest = function() {
      var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}])[0];
      scenario.creator = users[1].uuid; // try to set creator to user 'leinad'
      request(server)
        .post(api.reverse('scenario_list'))
        .send(scenario)
        .set('Content-type', 'application/json')
        .auth(users[0].local.email, 'leinad') // log in with user 'daniel'
        .expect(http.BAD_REQUEST)
        .end(done);
    };
    ss.insertUsers(users).catch(done).then(execTest);
  });

  it('should return 400 BAD_REQUEST when trying to set timestamp field', function(done) {
    var users = ss.loadUsers(['daniel','leinad']);
    var execTest = function() {
      var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}])[0];
      scenario.timestamp = moment().toISOString();
      request(server)
        .post(api.reverse('scenario_list'))
        .send(scenario)
        .set('Content-type', 'application/json')
        .auth(users[0].local.email, 'leinad') // log in with user 'daniel'
        .expect(http.BAD_REQUEST)
        .end(done);
    };
    ss.insertUsers(users).catch(done).then(execTest);
  });

  it('should return 400 BAD_REQUEST when trying to set version field', function(done) {
    var users = ss.loadUsers(['daniel','leinad']);
    var execTest = function() {
      var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}])[0];
      scenario.version = 7;
      request(server)
        .post(api.reverse('scenario_list'))
        .send(scenario)
        .set('Content-type', 'application/json')
        .auth(users[0].local.email, 'leinad') // log in with user 'daniel'
        .expect(http.BAD_REQUEST)
        .end(done);
    };
    ss.insertUsers(users).catch(done).then(execTest);
  });

  it('should have the logged in users UUID as creator and a timestamp in the returned document and location header',
    function(done) {
      var users = ss.loadUsers(['daniel','leinad']);
      var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}])[0];
      var scenarioInsert = ss.cloneConstrained(scenario);
      var execTest = function() {
        request(server)
          .post(api.reverse('scenario_list'))
          .send(scenarioInsert)
          .set('Content-type', 'application/json')
          .auth(users[0].local.email, users[0].local.__passwordplain) // log in with user 'daniel'
          .expect(function(res) {
            ss.scenarioUpdateFields.forEach(function(field) {
              expect(res.body[field]).to.eql(scenario[field]);
            });
            expect(res.body.uuid).to.be.ok();
            expect(res.headers.location).to.be.ok();
          })
          .expect(http.CREATED)
          .end(done);
      };
      ss.insertUsers(users).catch(done).then(execTest);
    }
  );

  it.skip('should return 400 BAD_REQUEST if a non-existing data source was linked in the scenario', function(done) {

  });

});

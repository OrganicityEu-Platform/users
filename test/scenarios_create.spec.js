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

describe('When creating a scenario, the API', function() {

  var users;

  beforeEach(function(done) {
    users = ss.loadUsers(['daniel', 'leinad']);
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
    users = undefined;
    mongoose.connection.close();
    if (server) {
      serverApp.stop(function() {
        ss.teardown(done);
      });
    }
  });

  /*
   * Helper method to simplyfy the tests
   */
  var inputValidationTestHelper = function(data, code, done, expect) {
    var execTest = function() {
      request(server)
        .post(api.reverse('scenario_list'))
        .send(data)
        .set('Content-type', 'application/json')
        .auth(users[0].local.email, users[0].local.__passwordplain) // log in with user 'daniel'
        .expect(code)
        .expect(expect || function() {})
        .end(done);
    };
    ss.insertUsers(users).catch(done).then(execTest);
  };

  // Include common tests
  scenarios_common_tests(function() {
    return server;
  }, function() {
    return users;
  }, inputValidationTestHelper, ss);

});

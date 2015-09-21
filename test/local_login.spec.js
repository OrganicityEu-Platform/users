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

describe('When login local, the API', function() {

  var users;
  var scenarios;

  var user;
  var url;

  beforeEach(function(done) {
    users = ss.loadUsers(['daniel', 'leinad', 'daniel_admin', 'leinad_moderator']);
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
  var inputValidationTestHelper = function(data, code, done, expect) {

    var testUrl = url || api.reverse('local-login');

    var execTest = function() {
      request(server)
        .post(testUrl)
        .send(data)
        .set('Content-type', 'application/json')
        .expect(code)
        .expect(expect || function() {})
        .end(done);
    };
    ss.insertUsers(users).catch(done).then(execTest);
  };

  it('should return 200 OK when trying to login with correct login data',
    function(done) {
      var testUser = users[0];
      var login = {
        email: testUser.local.email,
        password: testUser.local.__passwordplain
      };
      inputValidationTestHelper(login, http.OK, done, function(res) {
        expect(res.body.name).to.eql(testUser.name);
        expect(res.body.uuid).to.eql(testUser.uuid);
      });
    }
  );

  it('should return 200 OK when trying to login with password to short',
    function(done) {
      var login = {
        email: users[0].local.email,
        password: 'waste'
      };
      inputValidationTestHelper(login, http.BAD_REQUEST, done);
    }
  );

  it('should return 422 UNPROCESSABLE ENTITY when trying to login with incorrect password',
    function(done) {
      var login = {
        email: users[0].local.email,
        password: 'wastewaste'
      };
      inputValidationTestHelper(login, http.UNPROCESSABLE_ENTITY, done);
    }
  );

  it('should return 422 UNPROCESSABLE ENTITY when trying to login with incorrect email',
    function(done) {
      var testUser = users[0];
      var login = {
        email: 'test@test.de',
        password: testUser.local.__passwordplain
      };
      inputValidationTestHelper(login, http.UNPROCESSABLE_ENTITY, done);
    }
  );

  it('should return 400 BAD REQUEST when trying to login with non email',
    function(done) {
      var testUser = users[0];
      var login = {
        email: 'test',
        password: testUser.local.__passwordplain
      };
      inputValidationTestHelper(login, http.BAD_REQUEST, done);
    }
  );

});

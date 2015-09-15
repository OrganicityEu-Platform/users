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

describe('When updating a user, the API', function() {

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
  var inputValidationTestHelper = function(scenario, code, done, expect) {

    var testUrl = url || api.reverse('user_by_uuid', { uuid : 'daniel' });
    var testUser = user || users[0]; // Default "daniel"

    var execTest = function() {
      request(server)
        .patch(testUrl)
        .send(scenario)
        .set('Content-type', 'application/json')
        .auth(testUser.local.email, testUser.local.__passwordplain) // log in with user 'daniel'
        .expect(code)
        .expect(expect || function() {})
        .end(done);
    };
    ss.insertUsers(users).catch(done).then(execTest);
  };

  it('should return 403 FIRBIDDEN when trying to update an other user',
    function(done) {
      url = api.reverse('user_by_uuid', { uuid : 'leinad' });
      var user = {};
      inputValidationTestHelper(user, http.FORBIDDEN, done);
    }
  );

  it('should return 403 FIRBIDDEN when trying to update an other user',
    function(done) {
      url = api.reverse('user_by_uuid', { uuid : 'daniel_admin' });
      var user = {};
      inputValidationTestHelper(user, http.FORBIDDEN, done);
    }
  );

  it('should return 200 OK when trying to send an empty object',
    function(done) {
      var user = {};
      inputValidationTestHelper(user, http.OK, done);
    }
  );

  it('should return 200 OK when trying to update the name',
    function(done) {
      var user = {
        name: 'Daniel neu'
      };
      inputValidationTestHelper(user, http.OK, done, function(res) {
        expect(res.body.name).to.eql(user.name);
      });
    }
  );

  it('should return 400 BAD REQUEST when trying to update the name with a number',
    function(done) {
      var user = {
        name: 200
      };
      inputValidationTestHelper(user, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD REQUEST when trying to update the name to ``',
    function(done) {
      var user = {
        name: ''
      };
      inputValidationTestHelper(user, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD REQUEST when trying to update the email',
    function(done) {
      var user = {
        local : {
          email: 'test@test.de'
        }
      };
      inputValidationTestHelper(user, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD REQUEST when trying to update with an invalid field',
    function(done) {
      var user = {
        waste : ''
      };
      inputValidationTestHelper(user, http.BAD_REQUEST, done);
    }
  );

  it('should return 200 OK when trying to update the gender to `m`',
    function(done) {
      var user = {
        gender: 'm'
      };
      inputValidationTestHelper(user, http.OK, done, function(res) {
        expect(res.body.gender).to.eql(user.gender);
      });
    }
  );

  it('should return 200 OK when trying to update the gender to `f`',
    function(done) {
      var user = {
        gender: 'f'
      };
      inputValidationTestHelper(user, http.OK, done, function(res) {
        expect(res.body.gender).to.eql(user.gender);
      });
    }
  );

  it('should return 200 OK when trying to update the gender and the name',
    function(done) {
      var user = {
        gender: 'f',
        name: 'New name'
      };
      inputValidationTestHelper(user, http.OK, done, function(res) {
        expect(res.body.gender).to.eql(user.gender);
        expect(res.body.name).to.eql(user.name);
      });
    }
  );

  it('should return 200 OK when trying to update the password',
    function(done) {
      var user = {
        local: {
          password: 'newPass'
        }
      };
      inputValidationTestHelper(user, http.OK, done);
    }
  );

  it('should return 400 BAD REQUEST when trying to update the gender to `waste`',
    function(done) {
      var user = {
        gender: 'waste'
      };
      inputValidationTestHelper(user, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD REQUEST when trying to update the gender to a number',
    function(done) {
      var user = {
        gender: 100
      };
      inputValidationTestHelper(user, http.BAD_REQUEST, done);
    }
  );

  it('should return 403 FORBIDDEN when trying to update the roles as user',
    function(done) {
      var user = {
        roles: []
      };
      inputValidationTestHelper(user, http.FORBIDDEN, done);
    }
  );

  it('should return 200 OK when trying to update the roles to [] as admin',
    function(done) {
      user = users[2];
      var local_user = {
        roles: []
      };
      inputValidationTestHelper(local_user, http.OK, done, function(res) {
        expect(res.body.roles.length).to.eql(0);
      });
    }
  );

  it('should return 200 OK when trying to update the roles to `admin` as admin',
    function(done) {
      user = users[2];
      var local_user = {
        roles: ['admin']
      };
      inputValidationTestHelper(local_user, http.OK, done, function(res) {
        expect(res.body.roles.length).to.eql(1);
        expect(res.body.roles[0]).to.eql(local_user.roles[0]);
      });
    }
  );

  it('should return 200 OK when trying to update the roles to `moderator` as admin',
    function(done) {
      user = users[2];
      var local_user = {
        roles: ['moderator']
      };
      inputValidationTestHelper(local_user, http.OK, done, function(res) {
        expect(res.body.roles.length).to.eql(1);
        expect(res.body.roles[0]).to.eql(local_user.roles[0]);
      });
    }
  );

  it('should return 200 OK when trying to update the roles to `moderator and admin` as admin',
    function(done) {
      user = users[2];
      var local_user = {
        roles: ['moderator', 'admin']
      };
      inputValidationTestHelper(local_user, http.OK, done, function(res) {
        expect(res.body.roles.length).to.eql(2);
        expect(res.body.roles[0]).to.eql(local_user.roles[0]);
        expect(res.body.roles[1]).to.eql(local_user.roles[1]);
      });
    }
  );

  it('should return 403 FORBIDDEN when trying to update the roles to `waste` as admin',
    function(done) {
      user = users[2];
      var local_user = {
        roles: ['waste']
      };
      inputValidationTestHelper(local_user, http.BAD_REQUEST, done);
    }
  );

  it('should return 200 OK when trying to update everything as admin',
    function(done) {
      user = users[2];
      var local_user = {
        gender: 'f',
        name: 'New name',
        roles: ['admin'],
        local:  {
          password: 'newPass'
        }
      };
      inputValidationTestHelper(local_user, http.OK, done, function(res) {
        expect(res.body.gender).to.eql(local_user.gender);
        expect(res.body.name).to.eql(local_user.name);
        expect(res.body.roles.length).to.eql(1);
        expect(res.body.roles[0]).to.eql(local_user.roles[0]);
        // TODO: Test, if password was changed!
      });
    }
  );
});

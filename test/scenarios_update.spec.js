process.env.NODE_ENV = 'test';

var mongoose  = require('mongoose');
var request   = require('supertest');
var expect    = require('expect.js');
var moment    = require('moment');

var configDB  = require('../config/database.js');
var Scenario  = require('../models/schema/scenario.js');
var User      = require('../models/schema/user.js');
var api       = require('../api_routes.js');
var config    = require('../config/config.js');
var serverApp = require('../server.js');
var http      = require('http-status');

var ss        = require('./scenarios_setup.js');

var scenario_tests = require('./scenario_tests.js');

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

  // SAME AS CREATE

  // ######################################################################################
  // 401 UNAUTHORIZED
  // ######################################################################################

  it('should return 401 Unauthorized if the user is not logged in', function(done) {
    request(server)
      .post(api.reverse('scenario_list'))
      .send({})
      .set('Content-type', 'application/json')
      .expect(http.UNAUTHORIZED)
      .end(done);
  });

  /*
   * ####################################################
   *
   * These test are held simple. We expect 400, if the input is invalid and we expect 200, if the input is valid
   * These tests do not check the content of the response. This is done by next tests!
   *
   * ####################################################
   */

  // ######################################################################################
  // 400 BAD REQUEST
  // ######################################################################################

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (object not complete)',
    function(done) {
      var scenario = {};
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (object not complete)',
    function(done) {
      var scenario = {
        'title' : 'Foo'
      };
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (object not complete)',
    function(done) {
      var scenario = {
        'summary' : 'Foo'
      };
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (object not complete)',
    function(done) {
      var scenario = {
        'narrative' : 'Foo'
      };
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (title is an int)',
    function(done) {
      var scenario = {
        'title' : 100,
        'summary' : 'summary',
        'narrative' : 'narrative'
      };
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (summary is an int)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 100,
        'narrative' : 'narrative'
      };
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (narrative is an int)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 100
      };
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (actors array has an int)',
     function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative',
        'actors' : [1],
        'sectors' : [],
        'devices' : [],
        'dataSources' : []
      };
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (sectors array has an int)',
   function(done) {
     var scenario = {
       'title' : 'title',
       'summary' : 'summary',
       'narrative' : 'narrative',
       'actors' : [],
       'sectors' : [1],
       'devices' : [],
       'dataSources' : []
     };
     inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
   }
 );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (devices array has an int)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative',
        'actors' : [],
        'sectors' : [],
        'devices' : [1],
        'dataSources' : []
      };
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (trying to set uuid field)',
    function(done) {
      var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'none'}])[0]; // uuid already set
      scenario.uuid = 'agingpop';
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (trying to set creator field)',
    function(done) {
      var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'none'}])[0];
      scenario.creator = users[1].uuid; // try to set creator to user 'leinad'
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (trying to set timestamp field)',
    function(done) {
      var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'none'}])[0];
      scenario.timestamp = moment().toISOString();
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (trying to set version field)',
    function(done) {
      var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'none'}])[0];
      scenario.version = 7;
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (trying to set waste field)',
    function(done) {
      var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'none'}])[0];
      scenario.waste = ['waste1', 'waste2'];
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  // ######################################################################################
  // 200 OK
  // ######################################################################################

  it('should return 200 OK when trying to send a correct dummy object (required fields)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative'
      };
      inputValidationTestHelper(scenario, http.CREATED, done);
    }
  );

  it('should return 200 OK when trying to send a correct dummy object (required fields + empty arrays)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative',
        'actors' : [],
        'sectors' : [],
        'devices' : [],
        'dataSources' : []
      };
      inputValidationTestHelper(scenario, http.CREATED, done);
    }
  );

  it('should return 200 OK when trying to send a correct dummy object (required fields + actors array I)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative',
        'actors' : ['actor1'],
        'sectors' : [],
        'devices' : [],
        'dataSources' : []
      };
      inputValidationTestHelper(scenario, http.CREATED, done);
    }
  );

  it('should return 200 OK when trying to send a correct dummy object (required fields + actors array II)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative',
        'actors' : ['actor1', 'actor2'],
        'sectors' : [],
        'devices' : [],
        'dataSources' : []
      };
      inputValidationTestHelper(scenario, http.CREATED, done);
    }
  );

  it('should return 200 OK when trying to send a correct dummy object (required fields + sectors array I)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative',
        'actors' : [],
        'sectors' : ['sector1'],
        'devices' : [],
        'dataSources' : []
      };
      inputValidationTestHelper(scenario, http.CREATED, done);
    }
  );

  it('should return 200 OK when trying to send a correct dummy object (required fields + sectors array II)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative',
        'actors' : [],
        'sectors' : ['sector1', 'sector2'],
        'devices' : [],
        'dataSources' : []
      };
      inputValidationTestHelper(scenario, http.CREATED, done);
    }
  );

  it('should return 200 OK when trying to send a correct dummy object (required fields + devices array I)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative',
        'actors' : [],
        'sectors' : [],
        'devices' : ['device1'],
        'dataSources' : []
      };
      inputValidationTestHelper(scenario, http.CREATED, done);
    }
  );

  it('should return 200 OK when trying to send a correct dummy object (required fields + devices array II)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative',
        'actors' : [],
        'sectors' : [],
        'devices' : ['device1', 'device2'],
        'dataSources' : []
      };
      inputValidationTestHelper(scenario, http.CREATED, done);
    }
  );

  it('should return 200 OK when trying to send a correct dummy object (required fields + data sources array I)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative',
        'actors' : [],
        'sectors' : [],
        'devices' : [],
        'dataSources' : ['dataSource1']
      };
      inputValidationTestHelper(scenario, http.CREATED, done);
    }
  );

  it('should return 200 OK when trying to send a correct dummy object (required fields + data sources array II)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative',
        'actors' : [],
        'sectors' : [],
        'devices' : [],
        'dataSources' : ['dataSource1', 'dataSource2']
      };
      inputValidationTestHelper(scenario, http.CREATED, done);
    }
  );

  it('should return 200 OK when trying to send a correct dummy object (all fields)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative',
        'actors' : ['actor1', 'actor2'],
        'sectors' : ['sector1', 'sector2'],
        'devices' : ['device1', 'device2'],
        'dataSources' : ['dataSource1', 'dataSource2']
      };
      inputValidationTestHelper(scenario, http.CREATED, done);
    }
  );

  it('should return 200 OK when trying to send a correct dummy object (all fields)',
    function(done) {
      var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'none'}])[0];
      inputValidationTestHelper(scenario, http.CREATED, done);
    }
  );

  /*
   * ####################################################
   * INPUT VALIDATION - END
   * ####################################################
   */

  it('should have the logged in users UUID as creator and a timestamp in the returned document and location header',
    function(done) {
      var users = ss.loadUsers(['daniel', 'leinad']);
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

  it.skip('should return 400 BAD_REQUEST if a non-existing data source was linked in the scenario',
    function(done) {
    }
  );

  // SAME AS CREATE

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

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

var scenarioFieldsThatShouldEqual = [
  'uuid', 'version', 'title', 'summary', 'narrative', 'dataSources', 'actors', 'sectors',
  'devices', 'creator'
];

describe('When querying a scenario, the API', function() {

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

  it('should return only latest versions when asking for all latest versions', function(done) {

    var scenarios = ss.loadScenarios([
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'agingpop', v: 'v2'},
      {uuid: 'parkpred', v: 'v1'},
      {uuid: 'parkpred', v: 'v2'},
      {uuid: 'parkpred', v: 'v3'}
    ]);

    var execTest = function() {
      request(server)
        .get(api.reverse('scenario_list'))
        .expect(http.OK)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          expect(res.body.length).to.be(2); // only 2 latest versions
          scenarioFieldsThatShouldEqual.forEach(function(field) {
            expect(res.body[0][field]).to.eql(scenarios[1][field]); // agingpop_v2
            expect(res.body[1][field]).to.eql(scenarios[4][field]); // parkpred_v3
          });
        })
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  /**
   * Returns a function that verifies the result res contains an equal number of elements and the
   * scenarios in the request body correspond to the same order of UUIDs as given in the array
   * expected.
   */
  var verifyLengthAndUuidOrder = function(expected, res) {
    return function(res) {
      expect(res.body.length).to.be(expected.length);
      for (var i = 0; i < expected.length; i++) {
        expect(res.body[i].uuid).to.be(expected[i]);
      }
    };
  };

  it('should return scenarios in correct ascending order if sorted by title', function(done) {

    var scenarios = ss.loadScenarios([
      {uuid: 'contexttravel', v: 'v1'},
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'parkpred', v: 'v1'}
    ]);

    var execTest = function() {
      request(server)
        .get(api.reverse('scenario_list', null, { sortBy : 'title', sortDir : 'asc' }))
        .expect(http.OK)
        .expect('Content-Type', /json/)
        .expect(verifyLengthAndUuidOrder(['agingpop','contexttravel', 'parkpred']))
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should return scenarios in correct descending order if sorted by title descending', function(done) {

    var scenarios = ss.loadScenarios([
      {uuid: 'contexttravel', v: 'v1'},
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'parkpred', v: 'v1'}
    ]);

    var execTest = function() {
      request(server)
        .get(api.reverse('scenario_list', null, { sortBy : 'title', sortDir : 'desc' }))
        .expect(http.OK)
        .expect('Content-Type', /json/)
        .expect(verifyLengthAndUuidOrder(['parkpred', 'contexttravel', 'agingpop']))
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should return scenarios in correct ascending order if sorted by timestamp', function(done) {

    var scenarios = ss.loadScenarios([
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'parkpred', v: 'v1'},
      {uuid: 'contexttravel', v: 'v1'}
    ]);

    var execTest = function() {
      request(server)
        .get(api.reverse('scenario_list', null, { sortBy : 'timestamp', sortDir : 'asc' }))
        .expect(http.OK)
        .expect('Content-Type', /json/)
        .expect(verifyLengthAndUuidOrder(['agingpop','contexttravel', 'parkpred']))
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should return scenarios in correct descending order if sorted by timestamp descending', function(done) {

    var scenarios = ss.loadScenarios([
      {uuid: 'contexttravel', v: 'v1'},
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'parkpred', v: 'v1'}
    ]);

    var execTest = function() {
      request(server)
        .get(api.reverse('scenario_list', null, { sortBy : 'timestamp', sortDir : 'asc' }))
        .expect(http.OK)
        .expect('Content-Type', /json/)
        .expect(verifyLengthAndUuidOrder(['parkpred','contexttravel', 'agingpop']))
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should return only scenarios that include a given term when doing a term search', function(done) {

    var scenarios = ss.loadScenarios([
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'contexttravel', v: 'v1'},
      {uuid: 'parkpred', v: 'v1'}
    ]);

    var execTest = function() {
      request(server)
        .get(api.reverse('scenario_list', null, { q : 'city' }))
        .expect(http.OK)
        .expect('Content-Type', /json/)
        .expect(verifyLengthAndUuidOrder(['contexttravel', 'parkpred']))
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should return only scenarios with the given actor tag', function(done) {

    var scenarios = ss.loadScenarios([
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'contexttravel', v: 'v1'},
      {uuid: 'parkpred', v: 'v1'}
    ]);

    var execTest = function() {
      request(server)
        .get(api.reverse('scenario_list', null, { actors : 'public' }))
        .expect(http.OK)
        .expect('Content-Type', /json/)
        .expect(verifyLengthAndUuidOrder(['contexttravel','parkpred']))
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should return only scenarios that have ALL the given actor tags', function(done) {

    var scenarios = ss.loadScenarios([
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'contexttravel', v: 'v1'},
      {uuid: 'parkpred', v: 'v1'}
    ]);

    var execTest = function() {
      request(server)
        .get(api.reverse('scenario_list', null, { actors : 'public,citizen' }))
        .expect(http.OK)
        .expect('Content-Type', /json/)
        .expect(verifyLengthAndUuidOrder(['contexttravel','parkpred']))
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should return only scenarios with the given sector tag', function(done) {

    var scenarios = ss.loadScenarios([
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'contexttravel', v: 'v1'},
      {uuid: 'parkpred', v: 'v1'}
    ]);

    var execTest = function() {
      request(server)
        .get(api.reverse('scenario_list', null, { sectors : 'environment' }))
        .expect(http.OK)
        .expect('Content-Type', /json/)
        .expect(verifyLengthAndUuidOrder(['agingpop']))
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should return only scenarios that have ALL the given sector tags', function(done) {

    var scenarios = ss.loadScenarios([
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'contexttravel', v: 'v1'},
      {uuid: 'parkpred', v: 'v1'}
    ]);

    var execTest = function() {
      request(server)
        .get(api.reverse('scenario_list', null, { sectors : 'environment,logistics' }))
        .expect(http.OK)
        .expect('Content-Type', /json/)
        .expect(verifyLengthAndUuidOrder(['contexttravel']))
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should return only scenarios with the given device tag', function(done) {

    var scenarios = ss.loadScenarios([
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'contexttravel', v: 'v1'},
      {uuid: 'parkpred', v: 'v1'}
    ]);

    var execTest = function() {
      request(server)
        .get(api.reverse('scenario_list', null, { devices : 'sensors' }))
        .expect(http.OK)
        .expect('Content-Type', /json/)
        .expect(verifyLengthAndUuidOrder(['agingpop']))
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should return only scenarios that have ALL the given device tags', function(done) {

    var scenarios = ss.loadScenarios([
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'contexttravel', v: 'v1'},
      {uuid: 'parkpred', v: 'v1'}
    ]);

    var execTest = function() {
      request(server)
        .get(api.reverse('scenario_list', null, { devices : 'transport,mobile' }))
        .expect(http.OK)
        .expect('Content-Type', /json/)
        .expect(verifyLengthAndUuidOrder(['contexttravel','parkpred']))
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should return only scenarios by a given user', function(done) {

    var scenarios = ss.loadScenarios([
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'contexttravel', v: 'v1'},
      {uuid: 'parkpred', v: 'v1'}
    ]);

    var execTest = function() {
      request(server)
        .get(api.reverse('scenario_list', null, { creator : 'daniel' }))
        .expect(http.OK)
        .expect('Content-Type', /json/)
        .expect(verifyLengthAndUuidOrder(['agingpop']))
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should return the latest version of a scenario when retrieving by UUID', function(done) {

    var scenarios = ss.loadScenarios([
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'agingpop', v: 'v2'},
      {uuid: 'parkpred', v: 'v1'},
      {uuid: 'parkpred', v: 'v2'},
      {uuid: 'parkpred', v: 'v3'}
    ]);

    var execTest = function() {
      request(server)
        .get(api.reverse('scenario_by_uuid', { uuid : 'agingpop' }))
        .expect(http.OK)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          expect(res.body.length).to.be(1);
          expect(res.body[0].uuid).to.be('agingpop');
          expect(res.body[0].version).to.be(2);
        })
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should return 404 not found if scenario with the given UUID does not exist', function(done) {

    var scenarios = ss.loadScenarios([
      {uuid: 'agingpop', v: 'v1'},
      {uuid: 'parkpred', v: 'v1'}
    ]);

    var execTest = function() {
      request(server)
        .get(api.reverse('scenario_by_uuid', { uuid : 'notexistinguuid' }))
        .expect(http.NOT_FOUND)
        .expect('Content-Type', /json/)
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });
});

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
    if (server) {
      serverApp.stop(done);
    }
    mongoose.connection.close();
  });

  it.skip('should only allow setting fields that are defined in the ScenarioUpdate type', function(done) {

  });

  it.skip('should not allow if the user is not logged in', function(done) {

  });

  it.skip('should have the logged in users UUID as creator in the returned document', function(done) {

  });

  it.skip('should return 400 BAD_REQUEST if a non-existing data source was linked in the scenario', function(done) {

  });

});

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

  it('should only not allow setting uuid field', function(done) {

    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);

    var execTest = function() {

      var req = JSON.parse(JSON.stringify(scenarios[0]));
      req.uuid = 'notalloweduuid';

      request(server)
        .put(api.reverse('scenario_by_uuid', { uuid : 'agingpop' }))
        .send(req)
        .expect(http.BAD_REQUEST)
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should only not allow setting creator field', function(done) {

    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);

    var execTest = function() {

      var req = JSON.parse(JSON.stringify(scenarios[0]));
      req.creator = 'unknownme';

      request(server)
        .put(api.reverse('scenario_by_uuid', { uuid : 'agingpop' }))
        .send(req)
        .expect(http.BAD_REQUEST)
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should only not allow setting version field', function(done) {

    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);

    var execTest = function() {

      var req = JSON.parse(JSON.stringify(scenarios[0]));
      req.version = 3;

      request(server)
        .put(api.reverse('scenario_by_uuid', { uuid : 'agingpop' }))
        .send(req)
        .expect(http.BAD_REQUEST)
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it('should only not allow setting timestamp field', function(done) {

    var scenarios = ss.loadScenarios([{uuid: 'agingpop', v: 'v1'}]);

    var execTest = function() {

      var req = JSON.parse(JSON.stringify(scenarios[0]));
      req.timestamp = new Date().toISOString();

      request(server)
        .put(api.reverse('scenario_by_uuid', { uuid : 'agingpop' }))
        .send(req)
        .expect(http.BAD_REQUEST)
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });

  it.skip('should return the newly created scenario document with a version incremented by one', function(done) {

  });

  it.skip('should check if the UUID in the document equals the UUID in the URL', function(done) {

  });

  it.skip('should return 401 if the user is not logged in', function(done) {

  });

  it.skip('should return 404 not found if scenario with URL param UUID does not exist', function(done) {

  });

  it.skip('should return 403 forbidden if non-administrator, non-moderator user is not creator', function(done) {

  });

  it.skip('should allow if user is creator', function(done) {

  });

  it.skip('should allow if user is administrator', function(done) {

  });

  it.skip('should allow if user is moderator', function(done) {

  });

  it.skip('should return 400 BAD_REQUEST if a non-existing data source was linked in the scenario', function(done) {

  });

});

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

  it.skip('should return 404 not found if scenario with UUID does not exist', function(done) {

  });

  it.skip('should return 404 not found if scenario with UUID does exist but not the given version', function(done) {

  });

  it.skip('should return 403 forbidden if non-administrator, non-moderator user is not creator', function(done) {

  });

  it.skip('should return 401 if the user is not logged in', function(done) {

  });

  it.skip('should return 204 if the scenario version was succesfully deleted', function(done) {

  });
});

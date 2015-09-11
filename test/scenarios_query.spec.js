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

var scenarioFieldsThatShouldEqual = [
  'uuid', 'version', 'title', 'summary', 'narrative', 'dataSources', 'actors', 'sectors',
  'devices', 'creator'
];

var getScenarioFromResponse = function(res, uuid) {
  for (var i = 0; i < res.body.length; i++) {
    if (res.body[i].uuid === uuid) {
      return res.body[i];
    }
  }
  return null;
};

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
          var agingpop = getScenarioFromResponse(res, 'agingpop');
          var parkpred = getScenarioFromResponse(res, 'parkpred');
          scenarioFieldsThatShouldEqual.forEach(function(field) {
            expect(agingpop[field]).to.eql(scenarios[1][field]); // agingpop_v2
            expect(parkpred[field]).to.eql(scenarios[4][field]); // parkpred_v3
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
      expect(res.body.map(function(s) { return s.uuid; })).to.eql(expected);
    };
  };

  var verifyLengthAndUuidsContained = function(expectedUuids, res) {
    return function(res) {
      expect(res.body.length).to.be(expectedUuids.length);
      var uuidsInBody = res.body.map(function(s) { return s.uuid; });
      expectedUuids.forEach(function(uuid) {
        expect(uuidsInBody).to.contain(uuid);
      });
    };
  };

  it('should return scenarios in correct ascending order if sorted by title ascending', function(done) {

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

  it('should return scenarios in correct ascending order if sorted by timestamp ascending', function(done) {

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
        .expect(verifyLengthAndUuidOrder(['agingpop','parkpred', 'contexttravel']))
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
        .get(api.reverse('scenario_list', null, { sortBy : 'timestamp', sortDir : 'desc' }))
        .expect(http.OK)
        .expect('Content-Type', /json/)
        .expect(verifyLengthAndUuidOrder(['parkpred','agingpop', 'contexttravel']))
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

    var execTest = function(done, termsAndExpectedUuids) {

      var callDoneWhenDone = function() {
        for (var i = 0; i < termsAndExpectedUuids.length; i++) {
          if (!termsAndExpectedUuids[i].checked) {
            return;
          }
        }
        done();
      };

      var setChecked = function(obj) {
        return function() {
          obj.checked = true;
          callDoneWhenDone();
        };
      };

      return function() {
        for (var i = 0; i < termsAndExpectedUuids.length; i++) {
          request(server)
            .get(api.reverse('scenario_list', null, { q : termsAndExpectedUuids[i].term }))
            .expect(http.OK)
            .expect('Content-Type', /json/)
            .expect(verifyLengthAndUuidsContained(termsAndExpectedUuids[i].expectedUuids))
            .end(setChecked(termsAndExpectedUuids[i]));
        }
      };
    };

    var termsAndExpectedUuids = [
      { term : 'aging',     expectedUuids : ['agingpop']     ,            checked : false }, // title
      { term : 'AGING',     expectedUuids : ['agingpop']     ,            checked : false }, // title
      { term : 'aging',     expectedUuids : ['agingpop']     ,            checked : false }, // title
      { term : 'real',      expectedUuids : ['contexttravel'],            checked : false }, // title
      { term : 'REAl',      expectedUuids : ['contexttravel'],            checked : false }, // title
      { term : 'Real',      expectedUuids : ['contexttravel'],            checked : false }, // title
      { term : 'space',     expectedUuids : ['parkpred'],                 checked : false }, // title
      { term : 'SPACE',     expectedUuids : ['parkpred'],                 checked : false }, // title
      { term : 'Space',     expectedUuids : ['parkpred'],                 checked : false }, // title
      { term : 'different', expectedUuids : ['contexttravel','parkpred'], checked : false }, // narrative
      { term : 'there',     expectedUuids : ['contexttravel'],            checked : false }  // description
    ];

    ss.insertScenarios(scenarios).catch(done).then(execTest(done, termsAndExpectedUuids));
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
        .expect(verifyLengthAndUuidsContained(['contexttravel','parkpred']))
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
        .expect(verifyLengthAndUuidsContained(['contexttravel','parkpred']))
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
        .expect(verifyLengthAndUuidsContained(['agingpop']))
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
        .get(api.reverse('scenario_list', null, { sectors : 'transport,logistics' }))
        .expect(http.OK)
        .expect('Content-Type', /json/)
        .expect(verifyLengthAndUuidsContained(['contexttravel']))
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
        .expect(verifyLengthAndUuidsContained(['agingpop']))
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
        .expect(verifyLengthAndUuidsContained(['contexttravel','parkpred']))
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
        .expect(verifyLengthAndUuidsContained(['agingpop']))
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
          expect(res.body.uuid).to.be('agingpop');
          expect(res.body.version).to.be(2);
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
        .end(done);
    };

    ss.insertScenarios(scenarios).catch(done).then(execTest);
  });
});

var request          = require('supertest');
var expect          = require('expect.js');
var http            = require('http-status');
var api             = require('../api_routes.js');
var moment          = require('moment');
var fsSync          = require('fs-sync');
var SceanrioConfig  = require('../config/scenario.js');

var tests = function(getServer, getUsers, inputValidationTestHelper, ss) {

  // ######################################################################################
  // 401 UNAUTHORIZED
  // ######################################################################################

  it('should return 401 Unauthorized if the user is not logged in', function(done) {
    request(getServer())
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
      scenario.creator = getUsers()[1].uuid; // try to set creator to user 'leinad'
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

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (incorrect thumbnail field)',
    function(done) {
      var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'none'}])[0];
      scenario.thumbnail = 'waste';
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (title to long)',
    function(done) {
      var scenario = {
        'summary' : 'summary',
        'narrative' : 'narrative'
      };

      // Make title one char to long
      for (var i = 0; i <= SceanrioConfig.max.title; i++) {
        scenario.title += 'a';
      }

      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (narrative to long)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 'summary'
      };

      // Make narrative one char to long
      for (var i = 0; i <= SceanrioConfig.max.narrative; i++) {
        scenario.narrative += 'a';
      }

      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD_REQUEST when trying to send a corrupted dummy object (summary to long)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'narrative' : 'narrative'
      };

      // Make summary one char to long
      for (var i = 0; i <= SceanrioConfig.max.summary; i++) {
        scenario.summary += 'a';
      }

      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  // ######################################################################################
  // 201 CREATED
  // ######################################################################################

  it('should return 201 CREATED when trying to send a correct dummy object (required fields)',
    function(done) {
      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative'
      };
      inputValidationTestHelper(scenario, http.CREATED, done);
    }
  );

  it('should return 201 CREATED when trying to send a correct dummy object (required fields + empty arrays)',
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

  it('should return 201 CREATED when trying to send a correct dummy object (required fields + actors array I)',
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

  it('should return 201 CREATED when trying to send a correct dummy object (required fields + actors array II)',
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

  it('should return 201 CREATED when trying to send a correct dummy object (required fields + sectors array I)',
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

  it('should return 201 CREATED when trying to send a correct dummy object (required fields + sectors array II)',
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

  it('should return 201 CREATED when trying to send a correct dummy object (required fields + devices array I)',
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

  it('should return 201 CREATED when trying to send a correct dummy object (required fields + devices array II)',
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

  it('should return 201 CREATED when trying to send a correct dummy object (required fields + data sources array I)',
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

  it('should return 201 CREATED when trying to send a correct dummy object (required fields + data sources array II)',
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

  it('should return 201 CREATED when trying to send a correct dummy object (all fields with new file)',
    function(done) {

      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative',
        'actors' : ['actor1', 'actor2'],
        'sectors' : ['sector1', 'sector2'],
        'devices' : ['device1', 'device2'],
        'dataSources' : ['dataSource1', 'dataSource2'],
        'thumbnail' : 'tmp/thumb',
        'image' : 'tmp/image'
      };

      ss.createImage(scenario.thumbnail);
      ss.createImage(scenario.image);

      inputValidationTestHelper(scenario, http.CREATED, done);
    }
  );

  it('should return 201 CREATED when trying to send a correct dummy object (all fields with existing file)',
    function(done) {

      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative',
        'actors' : ['actor1', 'actor2'],
        'sectors' : ['sector1', 'sector2'],
        'devices' : ['device1', 'device2'],
        'dataSources' : ['dataSource1', 'dataSource2'],
        'thumbnail' : 'tmp/thumb',
        'image' : 'tmp/image'
      };

      ss.createImage(scenario.thumbnail);
      ss.createImage(scenario.image);

      inputValidationTestHelper(scenario, http.CREATED, done);
    }
  );

  it('should return 400 BAD REQUEST when trying to send a correct dummy object (images missed)',
    function(done) {

      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative',
        'actors' : ['actor1', 'actor2'],
        'sectors' : ['sector1', 'sector2'],
        'devices' : ['device1', 'device2'],
        'dataSources' : ['dataSource1', 'dataSource2'],
        'thumbnail' : 'tmp/thumb'
      };

      ss.createImage(scenario.thumbnail);

      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD REQUEST when trying to send a correct dummy object (thumbnail missed)',
    function(done) {

      var scenario = {
        'title' : 'title',
        'summary' : 'summary',
        'narrative' : 'narrative',
        'actors' : ['actor1', 'actor2'],
        'sectors' : ['sector1', 'sector2'],
        'devices' : ['device1', 'device2'],
        'dataSources' : ['dataSource1', 'dataSource2'],
        'image' : 'tmp/image'
      };

      ss.createImage(scenario.image);

      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 201 CREATED when trying to send a correct dummy object (all fields)',
    function(done) {
      var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'none'}])[0];
      inputValidationTestHelper(scenario, http.CREATED, done);
    }
  );

  it('should return 400 BAD REQUEST when trying to send a non existsing thumbnail (all fields)',
    function(done) {
      var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'none'}])[0];
      fsSync.remove(scenario.thumbnail);
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should return 400 BAD REQUEST when trying to send a non existsing image (all fields)',
    function(done) {
      var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'none'}])[0];
      fsSync.remove(scenario.image);
      inputValidationTestHelper(scenario, http.BAD_REQUEST, done);
    }
  );

  it('should have the logged in users UUID as creator and a timestamp in the returned document and location header',
    function(done) {
      var scenario = ss.loadScenarios([{uuid: 'agingpop', v: 'none'}])[0];
      inputValidationTestHelper(scenario, http.CREATED, done, function(res) {
          ss.scenarioUpdateFields.forEach(function(field) {
            expect(res.body[field]).to.eql(scenario[field]);
          });
          expect(res.body.uuid).to.be.ok();
          expect(res.headers.location).to.be.ok();
        });
    }
  );

  it.skip('should return 400 BAD_REQUEST if a non-existing data source was linked in the scenario',
    function(done) {
    }
  );

};

module.exports = tests;

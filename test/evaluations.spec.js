process.env.NODE_ENV = 'test';

var mongoose   = require('mongoose');
var request    = require('supertest');
var expect     = require('expect.js');
var moment     = require('moment');

var configDB   = require('../config/database.js');
var Evaluation = require('../models/schema/evaluation.js');
var api        = require('../api_routes.js');
var config     = require('../config/config.js');
var serverApp  = require('../server.js');
var http       = require('http-status');

var ss         = require('./evaluations_setup.js');

var server;

xdescribe('The evaluations API', function() {

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

  //////////////// GET

  it('should return 401 UNAUTHORIZED when not authenticated', function(done) {
    request(server)
      .get(api.reverse('evaluations_list'))
      .expect(http.UNAUTHORIZED)
      .end(done);
  });

  it('should return 403 FORBIDDEN when authenticated but not having admin or moderator role', function(done) {
    var users = ss.loadUsers(['daniel']);
    var execTest = function() {
      request(server)
        .get(api.reverse('evaluations_list'))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .expect(http.FORBIDDEN)
        .end(done);
    };
    ss.insertUsers(users).catch(done).then(execTest);
  });

  it('should return 400 BAD_REQUEST when using scenario_version without scenario_uuid', function(done) {
    var users = ss.loadUsers(['daniel_admin']);
    var execTest = function() {
      request(server)
        .get(api.reverse('evaluations_list', {}, { scenario_version : 1 }))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .expect(http.BAD_REQUEST)
        .end(done);
    };
    ss.insertUsers(users).catch(done).then(execTest);
  });

  it('should return 200 OK and all evaluations when queried without query parameters as moderator', function(done) {
    var users = ss.loadUsers(['leinad_moderator']);
    var evaluations = ss.loadEvaluations(['daniel_agingpop_1', 'daniel_agingpop_2']);
    var execTest = function() {
      request(server)
        .get(api.reverse('evaluations_list'))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .expect(http.OK)
        .expect(function(res) {
          expect(res.body[0]).to.eql(evaluations[0]);
          expect(res.body[1]).to.eql(evaluations[1]);
        })
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertEvaluations(evaluations)).catch(done).then(execTest);
  });

  it('should return 200 OK and all evaluations when queried without query parameters as admin', function(done) {
    var users = ss.loadUsers(['daniel_admin']);
    var evaluations = ss.loadEvaluations(['daniel_agingpop_1', 'daniel_agingpop_2']);
    var execTest = function() {
      request(server)
        .get(api.reverse('evaluations_list'))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .expect(http.OK)
        .expect(function(res) {
          expect(res.body[0]).to.eql(evaluations[0]);
          expect(res.body[1]).to.eql(evaluations[1]);
        })
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertEvaluations(evaluations)).catch(done).then(execTest);
  });

  it('should return 200 OK and return only a "limit" number evaluations, skipping "skip" when using paging',
    function(done) {
      var users = ss.loadUsers(['daniel_admin']);
      var evaluations = ss.loadEvaluations(['daniel_agingpop_1', 'daniel_agingpop_2']);
      var execTest = function() {
        request(server)
          .get(api.reverse('evaluations_list', {}, { skip : 1, limit : 1 }))
          .auth(users[0].local.email, users[0].local.__passwordplain)
          .expect(http.OK)
          .expect(function(res) {
            expect(res.body.length).to.eql(1);
            expect(res.body[0]).to.eql(evaluations[1]);
          })
          .end(done);
      };
      ss.insertUsers(users).then(ss.insertEvaluations(evaluations)).catch(done).then(execTest);
    }
  );

  it('should return 200 OK and only evaluations for a given scenario UUID when filtering by scenario UUID',
    function(done) {
      var users = ss.loadUsers(['daniel_admin']);
      var evaluations = ss.loadEvaluations(['daniel_agingpop_1', 'daniel_agingpop_2', 'daniel_parkpred_1']);
      var execTest = function() {
        request(server)
          .get(api.reverse('evaluations_list', {}, { scenario_uuid : 'parkpred' }))
          .auth(users[0].local.email, users[0].local.__passwordplain)
          .expect(http.OK)
          .expect(function(res) {
            expect(res.body.length).to.eql(1);
            expect(res.body[0]).to.eql(evaluations[2]);
          })
          .end(done);
      };
      ss.insertUsers(users).then(ss.insertEvaluations(evaluations)).catch(done).then(execTest);
    }
  );

  it('should return 200 OK and only evaluations for a given scenario UUID and version when filtering by ' +
    'scenario UUID and version', function(done) {
      var users = ss.loadUsers(['daniel_admin']);
      var evaluations = ss.loadEvaluations(['daniel_agingpop_1', 'daniel_agingpop_2', 'daniel_parkpred_1']);
      var execTest = function() {
        request(server)
          .get(api.reverse('evaluations_list', {}, { scenario_uuid : 'agingpop', scenario_version : 2 }))
          .auth(users[0].local.email, users[0].local.__passwordplain)
          .expect(http.OK)
          .expect(function(res) {
            expect(res.body.length).to.eql(1);
            expect(res.body[0]).to.eql(evaluations[1]);
          })
          .end(done);
      };
      ss.insertUsers(users).then(ss.insertEvaluations(evaluations)).catch(done).then(execTest);
    });

  it('should return 200 OK and only evaluations by a specific user when filtering by user UUID', function(done) {
    var users = ss.loadUsers(['daniel_admin']);
    var evaluations = ss.loadEvaluations([
      'daniel_agingpop_1',
      'daniel_agingpop_2',
      'daniel_parkpred_1',
      'leinad_parkpred_1'
    ]);
    var execTest = function() {
      request(server)
        .get(api.reverse('evaluations_list', {}, { user_uuid : 'leinad' }))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .expect(http.OK)
        .expect(function(res) {
          expect(res.body.length).to.eql(1);
          expect(res.body[0]).to.eql(evaluations[3]);
        })
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertEvaluations(evaluations)).catch(done).then(execTest);
  });

  it('should return 200 OK and only evaluations by a specific user for a specific scenario when filtering by ' +
    'user UUID and scenario UUID', function(done) {
      var users = ss.loadUsers(['daniel_admin']);
      var evaluations = ss.loadEvaluations([
        'daniel_agingpop_1',
        'daniel_agingpop_2',
        'daniel_parkpred_1',
        'leinad_parkpred_1'
      ]);
      var execTest = function() {
        request(server)
          .get(api.reverse('evaluations_list', {}, { user_uuid : 'daniel', scenario_uuid : 'agingpop' }))
          .auth(users[0].local.email, users[0].local.__passwordplain)
          .expect(http.OK)
          .expect(function(res) {
            expect(res.body.length).to.eql(2);
            expect(res.body[0]).to.eql(evaluations[0]);
            expect(res.body[1]).to.eql(evaluations[1]);
          })
          .end(done);
      };
      ss.insertUsers(users).then(ss.insertEvaluations(evaluations)).catch(done).then(execTest);
    });

  it('should return 200 OK and only evaluations by a specific user for a specific scenario and version when ' +
    'filtering by user UUID and scenario UUID and version', function(done) {
      var users = ss.loadUsers(['daniel_admin']);
      var evaluations = ss.loadEvaluations([
        'daniel_agingpop_1',
        'daniel_agingpop_2',
        'daniel_parkpred_1',
        'leinad_parkpred_1'
      ]);
      var execTest = function() {
        request(server)
          .get(api.reverse('evaluations_list', {}, {
            user_uuid : 'daniel',
            scenario_uuid : 'agingpop',
            scenario_version : 1
          }))
          .auth(users[0].local.email, users[0].local.__passwordplain)
          .expect(http.OK)
          .expect(function(res) {
            expect(res.body.length).to.eql(1);
            expect(res.body[0]).to.eql(evaluations[0]);
          })
          .end(done);
      };
      ss.insertUsers(users).then(ss.insertEvaluations(evaluations)).catch(done).then(execTest);
    });

  it('should return 401 UNAUTHORIZED when querying by UUID and not being authenticated', function(done) {
    request(server)
      .get(api.reverse('evaluation_by_uuid', { uuid : 'daniel_agingpop_1' }, {}))
      .expect(http.UNAUTHORIZED)
      .end(done);
  });

  it('should return 403 FORBIDDEN when querying by UUID and not being admin or administrator', function(done) {
    var users = ss.loadUsers(['daniel']);
    var execTest = function() {
      request(server)
        .get(api.reverse('evaluation_by_uuid', { uuid : 'daniel_agingpop_1' }, {}))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .expect(http.FORBIDDEN)
        .end(done);
    };
    ss.insertUsers(users).catch(done).then(execTest);
  });

  it('should return 200 OK and the specific evaluation when querying by UUID', function(done) {
    var users = ss.loadUsers(['daniel_admin']);
    var evaluations = ss.loadEvaluations([
      'daniel_agingpop_1',
      'daniel_agingpop_2'
    ]);
    var execTest = function() {
      request(server)
        .get(api.reverse('evaluation_by_uuid', { uuid : 'daniel_agingpop_1' }, {}))
        .auth(users[0].local.email, users[0].local.__passwordplain)
        .expect(http.OK)
        .expect(function(res) {
          expect(res.body).to.eql(evaluations[0]);
        })
        .end(done);
    };
    ss.insertUsers(users).then(ss.insertEvaluations(evaluations)).catch(done).then(execTest);
  });

  ///////////////// POST

  it('should return 401 UNAUTHORIZED when posting and not being authenticated', function(done) {
    var evaluation = ss.loadEvaluations(['daniel_agingpop_1'])[0];
    request(server)
      .post(api.reverse('evaluations_list'))
      .send(evaluation)
      .expect(http.UNAUTHORIZED)
      .end(done);
  });

  var evaluationUpdateFields = ['scenario','submitted','answers','comment'];

  var cloneConstrained = function(evaluation) {
    var clone = {};
    evaluationUpdateFields.forEach(function(field) {
      clone[field] = evaluation[field];
    });
    return clone;
  };

  it('should return 400 BAD_REQUEST when posting if request body is malformed (scenario missing)', function(done) {
    var user = ss.loadUsers(['daniel'])[0];
    var evaluation = cloneConstrained(ss.loadEvaluations(['daniel_agingpop_1'])[0]);
    delete evaluation.scenario;
    var execTest = function() {
      request(server)
        .post(api.reverse('evaluations_list'))
        .auth(user.local.email, user.local.__passwordplain)
        .send(evaluation)
        .expect(http.BAD_REQUEST)
        .end(done);
    };
    ss.insertUsers([user]).catch(done).then(execTest);
  });

  it('should return 400 BAD_REQUEST when posting if request body is malformed (uuid included)', function(done) {
    var user = ss.loadUsers(['daniel'])[0];
    var evaluation = cloneConstrained(ss.loadEvaluations(['daniel_agingpop_1'])[0]);
    evaluation.uuid = 'anyuuid';
    var execTest = function() {
      request(server)
        .post(api.reverse('evaluations_list'))
        .auth(user.local.email, user.local.__passwordplain)
        .send(evaluation)
        .expect(http.BAD_REQUEST)
        .end(done);
    };
    ss.insertUsers([user]).catch(done).then(execTest);
  });

  it('should return 400 BAD_REQUEST when posting if request body is malformed (user included)', function(done) {
    var user = ss.loadUsers(['daniel'])[0];
    var evaluation = cloneConstrained(ss.loadEvaluations(['daniel_agingpop_1'])[0]);
    evaluation.user = 'daniel';
    var execTest = function() {
      request(server)
        .post(api.reverse('evaluations_list'))
        .auth(user.local.email, user.local.__passwordplain)
        .send(evaluation)
        .expect(http.BAD_REQUEST)
        .end(done);
    };
    ss.insertUsers([user]).catch(done).then(execTest);
  });

  it('should return 400 BAD_REQUEST when posting if request body is malformed (timestamp included)', function(done) {
    var user = ss.loadUsers(['daniel'])[0];
    var evaluation = cloneConstrained(ss.loadEvaluations(['daniel_agingpop_1'])[0]);
    evaluation.user = 'daniel';
    var execTest = function() {
      request(server)
        .post(api.reverse('evaluations_list'))
        .auth(user.local.email, user.local.__passwordplain)
        .send(evaluation)
        .expect(http.BAD_REQUEST)
        .end(done);
    };
    ss.insertUsers([user]).catch(done).then(execTest);
  });

  it('should return 200 OK, the persisted evaluation and the location when successfully posting an ' +
    'evaluation', function(done) {
      var user = ss.loadUsers(['daniel'])[0];
      var evaluation = ss.loadEvaluations(['daniel_agingpop_1'])[0];
      var requestBody = cloneConstrained(evaluation);
      var execTest = function() {
        request(server)
          .post(api.reverse('evaluations_list'))
          .auth(user.local.email, user.local.__passwordplain)
          .send(requestBody)
          .expect(http.OK)
          .expect(function(res) {
            evaluationUpdateFields.forEach(function(field) {
              expect(res.body[field]).to.eql(evaluation[field]);
              expect(res.body.uuid).to.be.ok();
              expect(res.body.user).to.eql(user.uuid);
              expect(res.body.timestamp).to.be.ok();
              expect(res.headers.location).to.eql(api.reverse('evaluation_by_uuid', { uuid : res.body.uuid }));
            });
          })
          .end(done);
      };
      ss.insertUsers([user]).catch(done).then(execTest);
    });

  ///////////////// PATCH

  it('should return 401 UNAUTHORIZED when trying to patch and not being authenticated', function(done) {
    var evaluation = ss.loadEvaluations(['daniel_agingpop_1'])[0];
    request(server)
      .patch(api.reverse('evaluation_by_uuid', { uuid : 'anyuuid' }))
      .send(evaluation)
      .expect(http.UNAUTHORIZED)
      .end(done);
  });

  it('should return 403 FORBIDDEN when trying to patch, being authenticated, but not being the user that ' +
    'originally created this evaluation', function(done) {
      var user = ss.loadUsers(['leinad'])[0];
      var evaluation = ss.loadEvaluations(['daniel_agingpop_1'])[0];
      var requestBody = cloneConstrained(evaluation);
      var execTest = function() {
        request(server)
          .patch(api.reverse('evaluation_by_uuid', { uuid : evaluation.uuid }))
          .auth(user.local.email, user.local.__passwordplain)
          .send(requestBody)
          .expect(http.FORBIDDEN)
          .end(done);
      };
      ss.insertUsers([user]).then(ss.insertEvaluations([evaluation])).catch(done).then(execTest);
    });

  it('should return 403 FORBIDDEN when trying to patch but evaluation was already flagged as submitted',
    function(done) {
      var user = ss.loadUsers(['daniel'])[0];
      var evaluation = ss.loadEvaluations(['daniel_agingpop_2'])[0];
      var requestBody = cloneConstrained(evaluation);
      var execTest = function() {
        request(server)
          .patch(api.reverse('evaluation_by_uuid', { uuid : evaluation.uuid }))
          .auth(user.local.email, user.local.__passwordplain)
          .send(requestBody)
          .expect(http.FORBIDDEN)
          .end(done);
      };
      ss.insertUsers([user]).then(ss.insertEvaluations([evaluation])).catch(done).then(execTest);
    }
  );

  it('should return 400 BAD_REQUEST when patching if request body is malformed', function(done) {
    var user = ss.loadUsers(['daniel'])[0];
    var evaluation = ss.loadEvaluations(['daniel_agingpop_1'])[0];
    var requestBody = cloneConstrained(evaluation);
    evaluation.scenario.uuid = null;
    var execTest = function() {
      request(server)
        .patch(api.reverse('evaluation_by_uuid', { uuid : evaluation.uuid }))
        .auth(user.local.email, user.local.__passwordplain)
        .send(requestBody)
        .expect(http.BAD_REQUEST)
        .end(done);
    };
    ss.insertUsers([user]).then(ss.insertEvaluations([evaluation])).catch(done).then(execTest);
  });

  it('should return 200 OK and the updated evaluation when patching successfully', function(done) {
    var user = ss.loadUsers(['daniel'])[0];
    var evaluation = ss.loadEvaluations(['daniel_agingpop_1'])[0];
    var requestBody = cloneConstrained(evaluation);
    var execTest = function() {
      request(server)
        .patch(api.reverse('evaluation_by_uuid', { uuid : evaluation.uuid }))
        .auth(user.local.email, user.local.__passwordplain)
        .send(requestBody)
        .expect(http.OK)
        .expect(function(res) {
          evaluationUpdateFields.forEach(function(field) {
            expect(res.body[field]).to.eql(evaluation[field]);
          });
          expect(res.body.uuid).to.be.ok();
          expect(res.body.user).to.eql(user.uuid);
          expect(res.body.timestamp).to.be.ok();
        })
        .end(done);
    };
    ss.insertUsers([user]).then(ss.insertEvaluations([evaluation])).catch(done).then(execTest);
  });

});

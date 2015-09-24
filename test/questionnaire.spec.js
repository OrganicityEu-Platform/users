process.env.NODE_ENV = 'test';

var mongoose      = require('mongoose');
var request       = require('supertest');
var expect        = require('expect.js');
var moment        = require('moment');

var configDB      = require('../config/database.js');
var Questionnaire = require('../models/schema/questionnaire.js');
var api           = require('../api_routes.js');
var config        = require('../config/config.js');
var serverApp     = require('../server.js');
var http          = require('http-status');

var ss            = require('./questionnaire_setup.js');

var server;

xdescribe('The questionnaire API', function() {

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

  it('should return the latest questionnaire version when querying it', function(done) {
    var questionnaires = ss.loadQuestionnaires([1, 2, 3]);
    var execTest = function() {
      request(server)
        .get(api.reverse('questionnaire'))
        .send()
        .expect(http.OK)
        .expect(function(res) {
          expect(res.body).to.eql(questionnaires[2]);
        })
        .end(done);
    };
    ss.insertQuestionnaires(questionnaires).catch(done).then(execTest);
  });

  it('should return a specific questionnaire version when querying it', function(done) {
    var questionnaires = ss.loadQuestionnaires([1, 2, 3]);
    var execTest = function() {
      request(server)
        .get(api.reverse('questionnaire', {}, { version : 1 }))
        .send()
        .expect(http.OK)
        .expect(function(res) {
          expect(res.body).to.eql(questionnaires[0]);
        })
        .end(done);
    };
    ss.insertQuestionnaires(questionnaires).catch(done).then(execTest);
  });

  it('should return all questionnaires versions when querying for all', function(done) {
    var questionnaires = ss.loadQuestionnaires([1, 2, 3]);
    var execTest = function() {
      request(server)
        .get(api.reverse('questionnaire', {}, { version : 'all' }))
        .send()
        .expect(http.OK)
        .expect(function(res) {
          expect(res.body.length === 3);
          expect(res.body[0]).to.eql(questionnaires[2]);
          expect(res.body[1]).to.eql(questionnaires[1]);
          expect(res.body[2]).to.eql(questionnaires[0]);
        })
        .end(done);
    };
    ss.insertQuestionnaires(questionnaires).catch(done).then(execTest);
  });

  ///////////////// PATCH

  it('should return 401 UNAUTHORIZED when trying to patch and not being authenticated', function(done) {
    var questionnaire = ss.loadQuestionnaires([1])[0];
    request(server)
      .patch(api.reverse('questionnaire'))
      .send(questionnaire)
      .expect(http.UNAUTHORIZED)
      .end(done);
  });

  it('should return 403 FORBIDDEN when trying to patch and being authenticated but not having admin role',
    function(done) {
      var user = ss.loadUsers(['daniel'])[0];
      var questionnaire = ss.loadQuestionnaires([1])[0];
      var execTest = function() {
        request(server)
          .patch(api.reverse('questionnaire'))
          .auth(user.local.email, user.local.__passwordplain)
          .send(questionnaire)
          .expect(http.FORBIDDEN)
          .end(done);
      };
      ss.insertUsers([user]).then(ss.insertQuestionnaires([questionnaire])).catch(done).then(execTest);
    }
  );

  it('should return 200 OK and the updated questionnaire when patching', function(done) {
    var user = ss.loadUsers(['daniel_admin'])[0];
    var questionnaires = ss.loadQuestionnaires([1]);
    var requestBody = ss.loadQuestionnaires([2])[0];
    var execTest = function() {
      request(server)
        .patch(api.reverse('questionnaire'))
        .auth(user.local.email, user.local.__passwordplain)
        .send(requestBody)
        .expect(http.OK)
        .expect(function(res) {
          expect(res.body).to.eql(requestBody);
          expect(res.body.version).to.eql(2);
          expect(res.body.author).to.eql(user.uuid);
        })
        .end(done);
    };
    ss.insertUsers([user]).then(ss.insertQuestionnaires(questionnaires)).catch(done).then(execTest);
  });

  ///////////////// POST

  it('should return 401 UNAUTHORIZED when trying to post and not being authenticated', function(done) {
    var questionnaire = ss.loadQuestionnaires([1])[0];
    request(server)
      .post(api.reverse('questionnaire'))
      .send(questionnaire)
      .expect(http.UNAUTHORIZED)
      .end(done);
  });

  it('should return 403 FORBIDDEN when trying to post and being authenticated but not having admin role',
    function(done) {
      var user = ss.loadUsers(['daniel'])[0];
      var questionnaire = ss.loadQuestionnaires([1])[0];
      var execTest = function() {
        request(server)
          .post(api.reverse('questionnaire'))
          .auth(user.local.email, user.local.__passwordplain)
          .send(questionnaire)
          .expect(http.FORBIDDEN)
          .end(done);
      };
      ss.insertUsers([user]).then(ss.insertQuestionnaires([questionnaire])).catch(done).then(execTest);
    }
  );

  it('should return 200 OK, a location header and the newly created questionnaire when posting', function(done) {
    var user = ss.loadUsers(['daniel_admin'])[0];
    var questionnaires = ss.loadQuestionnaires([1]);
    var requestBody = ss.loadQuestionnaires([2])[0];
    var execTest = function() {
      request(server)
        .post(api.reverse('questionnaire'))
        .auth(user.local.email, user.local.__passwordplain)
        .send(requestBody)
        .expect(http.OK)
        .expect(function(res) {
          expect(res.body).to.eql(requestBody);
          expect(res.body.version).to.eql(2);
          expect(res.body.author).to.eql(user.uuid);
        })
        .end(done);
    };
    ss.insertUsers([user]).then(ss.insertQuestionnaires(questionnaires)).catch(done).then(execTest);
  });

});

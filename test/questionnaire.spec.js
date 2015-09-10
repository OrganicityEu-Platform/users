process.env.NODE_ENV = 'test';

var mongoose      = require('mongoose');
var request       = require('supertest');
var expect        = require('expect.js');
var moment        = require('moment');

var configDB      = require('../config/database.js');
var Questionnaire = require('../models/questionnaire.js');
var Question      = require('../models/question.js');
var api           = require('../api_routes.js');
var config        = require('../config/config.js');
var serverApp     = require('../server.js');
var http          = require('http-status');

var ss            = require('./questionnaire_setup.js');

var server;

describe('The questionnaire API', function() {

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

  it.skip('should return the latest questionnaire version when querying it', function(done) {

  });

  it.skip('should return a specific questionnaire version when querying it', function(done) {

  });

  it.skip('should return a all questionnaire versions when querying for all', function(done) {

  });

  ///////////////// PATCH

  it.skip('should return 401 UNAUTHORIZED when trying to patch and not being authenticated', function(done) {

  });

  it.skip('should return 403 FORBIDDEN when trying to patch and being authenticated but not having admin role',
    function(done) {

    }
  );

  it.skip('should return 200 OK and the updated questionniare when patching', function(done) {

  });

  ///////////////// POST

  it.skip('should return 401 UNAUTHORIZED when trying to post and not being authenticated', function(done) {

  });

  it.skip('should return 403 FORBIDDEN when trying to post and being authenticated but not having admin role',
    function(done) {

    }
  );

  it.skip('should return 200 OK, a location header and the newly created questionnaire when posting', function(done) {

  });

});

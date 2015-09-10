process.env.NODE_ENV = 'test';

var mongoose   = require('mongoose');
var request    = require('supertest');
var expect     = require('expect.js');
var moment     = require('moment');

var configDB   = require('../config/database.js');
var Evaluation = require('../models/evaluation.js');
var api        = require('../api_routes.js');
var config     = require('../config/config.js');
var serverApp  = require('../server.js');
var http       = require('http-status');

var ss         = require('./evaluations_setup.js');

var server;

describe('The evaluations API', function() {

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

  it.skip('should return 401 UNAUTHORIZED when not authenticated', function(done) {

  });

  it.skip('should return 403 FORBIDDEN when authenticated but not having admin or moderator role', function(done) {

  });

  it.skip('should return 200 OK and all evaluations when queried without query parameters', function(done) {

  });

  it.skip('should return 200 OK and return only a "limit" number evaluations, skipping "skip" when using paging',
    function(done) {

    }
  );

  it.skip('should return 200 OK and only evaluations for a given scenario UUID when filtering by scenario UUID',
    function(done) {

    }
  );

  it.skip('should return 200 OK and only evaluations for a given scenario UUID and version when filtering by ' +
    'scenario UUID and version', function(done) {

    });

  it.skip('should return 200 OK and only evaluations by a specific user when filtering by user UUID', function(done) {

  });

  it.skip('should return 200 OK and only evaluations by a specific user for a specific scenario when filtering by ' +
    'user UUID and scenario UUID', function(done) {

    });

  it.skip('should return 200 OK and only evaluations by a specific user for a specific scenario and version when ' +
    'filtering by user UUID and scenario UUID and version', function(done) {

    });

  it.skip('should return 200 OK and the specific evaluation when querying by UUID', function(done) {

  });

  ///////////////// POST

  it.skip('should return 401 UNAUTHORIZED when posting and not being authenticated', function(done) {

  });

  it.skip('should return 400 BAD_REQUEST when posting if request body is malformed', function(done) {

  });

  it.skip('should return 200 OK, the persisted evaluation and the location when successfully posting an ' +
    'evaluation', function(done) {

    });

  ///////////////// PATCH

  it.skip('should return 401 UNAUTHORIZED when trying to patch and not being authenticated', function(done) {

  });

  it.skip('should return 403 FORBIDDEN when trying to patch, being authenticated, but not being the user that ' +
    'originally created this evaluation', function(done) {

    });

  it.skip('should return 400 BAD_REQUEST when patching if request body is malformed', function(done) {

  });

  it.skip('should return 200 OK and the updated evaluation when patching successfully', function(done) {

  });

});

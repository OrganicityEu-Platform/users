var fs       = require('fs');
var mongojs  = require('mongojs');
var configDB = require('../config/database.js');
var Scenario = require('../models/scenario.js');
var User     = require('../models/userSchema.js');
var ss       = require('./scenarios_setup.js');

describe('first test suite', function() {

  var db;

  beforeEach(function(done) {
    var promise = ss.setup(configDB.test_url);
    console.log(promise);
    promise.then(function(conn) {
        db = conn;
        console.log(db);
        done();
      })
      .catch(function(err) {
        console.log(err);
        console.log(err.stack);
        done(err);
      });
  });

  afterEach(function(done) {
    ss.teardown();
    db = null;
  });

  it('2 should equal 2', function() {
    expect('2').toBe('2');
  });

  it('1 should not equal 2', function() {
    expect('1').not.toBe('2');
  });

  it('2 should not equal 3', function() {
    expect('2').not.toBe('3');
  });
});

// search.js

var mongoose = require('mongoose');
var uuid = require('node-uuid');
var crypto = require('crypto');

var configDB = require('../config/database.js');
mongoose.connect(configDB.url); // connect to our database

var Scenario = require('../models/Scenario.js');

Scenario.find(function(err, scenarios) {
  console.log('#Scenarios: ', scenarios.length);

  Scenario.search('Test', {title: 1}, {
    conditions: {title: {$exists: true}},
    sort: {title: 1},
    limit: 10
  }, function(err, data) {
    console.log(data.totalCount);
    console.log(data.results);
  });

});


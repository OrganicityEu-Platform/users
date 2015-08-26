var mongoose = require('mongoose');
var configDB = require('../config/database.js');
var Scenario = require('../models/scenario.js');
var User     = require('../models/userSchema.js');
var ss       = require('./scenarios_setup.js');

mongoose.connect(configDB.test_url);

console.log('Inserting scenarios...');
ss.insertScenarios([{uuid: 'agingpop', v: 'v1'}, {uuid: 'agingpop', v: 'v2'}], function(err) {
  if (err) {
    throw err;
  }
  console.log('Inserted, querying now..');
  Scenario.find(function(err, scenarios) {
    console.log(scenarios);
  });
});

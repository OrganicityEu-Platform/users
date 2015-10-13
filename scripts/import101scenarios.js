// Import 101 Scenarios
// node scripts/import101scenarios.js U-U-I-D

var mongoose  = require('mongoose');
var configDB  = require('../config/database.js');
var uuid      = require('node-uuid');
var crypto    = require('crypto');
var uuid      = require('node-uuid');
var Scenario  = require('../models/schema/scenario.js');

if (!process.argv[2]) {
  console.error('No creator-UUID given!');
  process.exit();
}

mongoose.connect(configDB.url);

var creator_uuid = process.argv[2];

var fs = require('fs');

console.log(__dirname);

fs.readFile(__dirname + '/101scenarios/scenarios_w_devices.json', function(err, data) {
  if (err) {
    throw err;
  }
  var o = JSON.parse(data.toString());

  for (var i = 0; i < o.length; i++) {
    var idx = i + 1;
    console.log('Import scenario ' + idx + ' of ' + o.length);

    var scenario = new Scenario(o[i]);
    scenario.version = 1;
    scenario.summary = scenario.narrative;
    scenario.uuid = uuid.v4();
    scenario.creator = creator_uuid;

    scenario.save(function(err) {
      if (err) {
        console.error('ERROR', err);
      }
    });
  }

});

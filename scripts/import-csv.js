var fs              = require('fs');
var parse           = require('csv-parse');

var mongoose        = require('mongoose');
var configDB        = require('../config/database.js');

var Scenario        = require('../models/schema/scenario.js');
var ScenarioConfig  = require('../config/scenario.js');

var ellipsis        = require('../util/ellipsis.js');
var uuid            = require('node-uuid');

if (!process.argv[2]) {
  console.error('Two parameters needed: uuid csv');
  process.exit();
}

var creator_uuid = process.argv[2];

if (!process.argv[3]) {
  console.error('Two parameters needed: uuid csv');
  process.exit();
}

var file = process.argv[3];

mongoose.connect(configDB.url);

var cleanTags = function(tags) {
  return tags.split(',').map(function(s) {
    return s.trim();
  });
};

var parser = parse({delimiter: ','}, function(err, data) {

  // The first line
  for (var i = 1 ; i < data.length; i++) {

    console.log('Import scenario ' + i + ' of ' + (data.length - 1));

    var s = {};
    s.version = 1;
    s.uuid = uuid.v4();
    s.title = data[i][1];
    s.creator = creator_uuid;
    s.summary = ellipsis(data[i][2], ScenarioConfig.max.summary - 5);
    s.narrative = data[i][2];

    s.credit = data[i][4];
    s.sectors = cleanTags(data[i][5]);
    s.actors = cleanTags(data[i][6]);

    var scenario = new Scenario(s);
    scenario.save(function(err) {
      if (err) {
        console.error('ERROR', err);
      } else {
        console.log('Import done!');
      }
    });

  }

});

fs.createReadStream(file).pipe(parser);

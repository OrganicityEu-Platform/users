var fs              = require('fs');
var parse           = require('csv-parse');

var mongoose        = require('mongoose');
var configDB        = require('../../config/database.js');

var Report          = require('../../models/schema/report.js');
var ReportConfig    = require('../../config/report.js');

var ellipsis        = require('../../util/ellipsis.js');
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
  if (!tags) {
    return null;
  }
  return tags.split(',').map(function(s) {
    var focusOn = /focus on.*\:\s*/i;
    s = s.replace(focusOn, '');
    return s.trim();
  });
};

var parser = parse({delimiter: ';'}, function(err, data) {

  if (err) {
    console.error('ERROR', err);
    return;
  }

  // The first line
  for (var i = 1 ; i < data.length; i++) {

    console.log('Import report ' + i + ' of ' + (data.length - 1));

    var s = {};
    s.version = 1;
    s.uuid = uuid.v4();
    s.title = data[i][1];
    s.creator = creator_uuid;
    s.credit = data[i][2];
    s.organizations = cleanTags(data[i][2]);
    s.orgtypes = cleanTags(data[i][3]);
    s.types = cleanTags(data[i][4]);
    s.year = data[i][5];
    s.areas = cleanTags(data[i][6]);
    s.domains = cleanTags(data[i][7]);
    s.approaches = data[i][8];
    s.tags = cleanTags(data[i][9]);
    s.abstract = ellipsis(data[i][10], ReportConfig.max.abstract - 5);

    var report = new Report(s);
    report.save(function(err) {
      if (err) {
        console.error('ERROR', err);
      } else {
        console.log('Import done!');
      }
    });
  }

});

fs.createReadStream(file).pipe(parser);

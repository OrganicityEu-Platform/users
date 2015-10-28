var mongoose = require('mongoose');

var scenario = mongoose.Schema({
  uuid        : { type: String, required: false }, // same for all versions
  version     : { type: Number, required: true  }, // server-incremented
  title       : { type: String, required: true  }, // plain text
  summary     : { type: String, required: true  }, // plain text
  narrative   : { type: String, required: true  }, // markdown
  creator     : { type: String, required: true  }, // user uuid
  image       : { type: String                  }, // the thumbnail
  thumbnail   : { type: String                  }, // the thumbnail
  timestamp   : { type: Date, default: Date.now }, // set when created
  actors      : { type: [String]                }, // tags (comma-separated)
  sectors     : { type: [String]                }, // tags (comma-separated)
  devices     : { type: [String]                }, // tags (comma-separated)
  dataSources : { type: [String]                }, // uuids of data source type
});

scenario.index(
  {
    title : 'text',
    summary : 'text',
    narrative : 'text'
  },
  {
    name : 'ScenariosTextIndex'
  }
);

// make sure options exist
if (!scenario.options.toObject) {
  scenario.options.toObject = {};
}

// apply transform option
scenario.options.toObject.transform = function(original, transformed) {
  delete transformed._id;
  delete transformed.__v;
};

var Scenario = mongoose.model('Scenario', scenario);
//mongoose.set('debug', true);
Scenario.ensureIndexes(function(err) {
  if (err) {
    throw err;
  }
});

module.exports = Scenario;

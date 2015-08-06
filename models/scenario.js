var mongoose = require('mongoose');

var scenarioSchema = mongoose.Schema(

    {
        uuid        : { type: String, required: false, index: true }, // same for all versions
        version     : { type: Number, required: true, index: true  }, // server-incremented
        title       : { type: String, required: true  }, // plain text
        summary     : { type: String, required: true  }, // plain text
        narrative   : { type: String, required: true  }, // markdown
        creator     : { type: String                  }, // user uuid
        timestamp   : { type: Date, default: Date.now }, // set when created
        actors      : { type: [String]                }, // tags (comma-separated)
        sectors     : { type: [String]                }, // tags (comma-separated)
        devices     : { type: [String]                }, // tags (comma-separated)
        dataSources : { type: [String]                }, // uuids of data source type
    }
);

module.exports = mongoose.model('Scenario', scenarioSchema);

var mongoose = require('mongoose');

var report = mongoose.Schema({
  uuid         : { type: String, required: false }, // same for all versions
  version      : { type: Number, required: true  }, // server-incremented
  title        : { type: String, required: true  }, // plain text
  abstract     : { type: String, required: true  }, // markdown
  year         : { type: String, required: true  }, // plain text
  creator      : { type: String, required: true  }, // user uuid
  image        : { type: String                  }, // the image
  thumbnail    : { type: String                  }, // the thumbnail
  credit       : { type: String                  }, // the credit
  copyright    : { type: String                  }, // the copyrght
  timestamp    : { type: Date, default: Date.now }, // set when created
  areas        : { type: [String]                }, // tags (comma-separated)
  domains      : { type: [String]                }, // tags (comma-separated)
  organizations: { type: [String]                }, // tags (comma-separated)
  orgtypes     : { type: [String]                }, // tags (comma-separated)
  types        : { type: [String]                }, // tags (comma-separated)
  approaches   : { type: [String]                }, // tags (comma-separated)
  tags         : { type: [String]                }, // tags (comma-separated)
  url          : { type: String                  }, // link to report
});

report.index(
  {
    title : 'text',
    abstract : 'text'
  },
  {
    name : 'ReportsTextIndex'
  }
);

// make sure options exist
if (!report.options.toObject) {
  report.options.toObject = {};
}

// apply transform option
report.options.toObject.transform = function(original, transformed) {
  delete transformed._id;
  delete transformed.__v;
};

var Report = mongoose.model('Report', report);
//mongoose.set('debug', true);
Report.ensureIndexes(function(err) {
  if (err) {
    throw err;
  }
});

module.exports = Report;

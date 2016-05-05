var mongoose = require('mongoose');

var schema = mongoose.Schema({
  uuid      : { type: String, required: false   }, // UUID of this feedback instance
  user      : { type: String, required: true    }, // UUID of user that provided the feedback
  like      : { type: String, required: true    },
  dislike   : { type: String, required: true    },
  timestamp : { type: Date                      }, // set when created
  scenario  : {
    uuid    : { type: String, required: true    }, // UUID of the scenario that is being evaluated
    version : { type: Number, required: true    }, // version of the scenario that is being evaluated
  }
});

module.exports = mongoose.model('Feedback', schema);

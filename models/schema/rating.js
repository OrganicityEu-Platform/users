var mongoose = require('mongoose');

var schema = mongoose.Schema({
  uuid      : { type: String, required: false   }, // UUID of this rating instance
  user      : { type: String, required: true    }, // UUID of user that rated this instance
  rating    : { type: Number, required: true    },
  scenario  : {
    uuid    : { type: String, required: true    }, // UUID of the scenario that is being rated
    version : { type: Number, required: true    }, // version of the scenario that is being rated
  }
});

module.exports = mongoose.model('Rating', schema);

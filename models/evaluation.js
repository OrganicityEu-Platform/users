var mongoose = require('mongoose');

var schema = mongoose.Schema({
  uuid      : { type: String, required: true    }, // UUID of this evaluation instance
  user      : { type: String, required: true    }, // UUID of user that created this evaluation instance
  scenario  : {
    uuid    : { type: String, required: true    }, // UUID of the scenario that is being evaluated
    version : { type: Number, required: true    }, // version of the scenario that is being evaluated
  },
  timestamp : { type: Date,   default: Date.now }, // set when created, reset when updated
  submitted : { type: Boolean, default: false   }, // set to true once the user presses submit
  answers   : {
    question : { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }, // the question that was answered
    answer   : { type: String                   }  // the value that was picked as answer by the user, might be unanswered
  },
  comment   : { type: String, required: false   }  // user can optionally write comments if he feels it necessary
});

// make sure options exist
if (!schema.options.toObject) {
  schema.options.toObject = {};
}

// apply transform option
schema.options.toObject.transform = function(original, transformed) {
  delete transformed._id;
  delete transformed.__v;
};

module.exports = mongoose.model('Evaluation', schema);

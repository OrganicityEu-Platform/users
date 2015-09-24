var mongoose = require('mongoose');

var schema = mongoose.Schema({
  version     : { type: Number,     required: true }, // assigned by server, incremented on each post
  author      : { type: String,     required: true }, // UUID of user that created this version
  description : { type: String                     }, // for "internal" use, not displayed to users
  explanation : { type: String,     required: true }, // explanatory text displayed to users on top of the questionnaire
  questions   : [{
    tech   : { type: Boolean,  required: true },
    text   : { type: String,   required: true },
    values : [{  // possible values the user can choose from
      value:  { type: String, required: true }, // text value displayed to the user
      weight: { type: Number, required: true }  // number value that is used to calculate scenario ratings (higher = better)
    }]
  }]  // array of questions to be filled out by users
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

module.exports = mongoose.model('Questionnaire', schema);

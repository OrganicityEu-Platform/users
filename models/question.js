var mongoose = require('mongoose');

var schema = mongoose.Schema({
  uuid   : { type: String,   required: true }, // UUID of this question, created on creation / update
  tech   : { type: Boolean,  required: true }, // true if question falls under technological category
  text   : { type: String,   required: true }, // question description displayed to the user
  values : { type: [String], required: true }  // possible values the user can choose from
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

module.exports = mongoose.model('Question', schema);

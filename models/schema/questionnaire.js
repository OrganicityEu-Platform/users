var mongoose = require('mongoose');
var Question = require('./question.js');

var schema = mongoose.Schema({
  version     : { type: Number,     required: true }, // assigned by server, incremented on each post
  author      : { type: String,     required: true }, // UUID of user that created this version
  description : { type: String                     }, // for "internal" use, not displayed to users
  explanation : { type: String,     required: true }, // explanatory text displayed to users on top of the questionnaire
  questions   : { type: [Question], required: true }  // array of questions to be filled out by users
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

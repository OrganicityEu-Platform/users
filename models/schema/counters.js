var mongoose = require('mongoose');

var Counters = new mongoose.Schema({
  _id: String,
  next: {type: Number, default: 1}
});

Counters.statics.increment = function(counter, callback) {
  return this.findByIdAndUpdate(counter, { $inc: { next: 1 } }, {new: true, upsert: true, select: {next: 1}}, callback);
};

var Counters = mongoose.model('counters', Counters);

module.exports = Counters;

/*

var mongoose = require('mongoose');

// @see: http://stackoverflow.com/a/7592756/605890

var Counters = mongoose.Schema({
  _id: String,
  next: Number
});

Counters.statics.findAndModify = function(query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};

Counters.statics.increment = function(counter, callback) {
  return this.collection.findAndModify({ _id: counter }, [], { $inc: { next: 1 } }, callback);
};

var Counters = mongoose.model('counters', Counters);

module.exports = Counters;

*/

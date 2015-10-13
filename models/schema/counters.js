var mongoose = require('mongoose');

// Taken from: http://stackoverflow.com/a/13015739/605890

var Counters = new mongoose.Schema({
  _id: String,
  next: {type: Number, default: 1}
});

Counters.statics.increment = function(counter, callback) {
  return this.findByIdAndUpdate(counter, { $inc: { next: 1 } }, {new: true, upsert: true, select: {next: 1}}, callback);
};

var Counters = mongoose.model('counters', Counters);

module.exports = Counters;

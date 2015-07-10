var mongoose = require('mongoose');

var ScenarioSchema = new mongoose.Schema({
    title: String,
    text: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scenario', ScenarioSchema);

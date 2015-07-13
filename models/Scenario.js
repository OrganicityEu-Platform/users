var mongoose = require('mongoose');
var searchPlugin = require('mongoose-search-plugin');

var ScenarioSchema = new mongoose.Schema({
    title: String,
    text: String,
    owner: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

ScenarioSchema.plugin(searchPlugin, {
    fields: ['title', 'text']
});

ScenarioSchema.methods.hasOwner = function(user) {
    return (user.uuid === this.owner);
};

module.exports = mongoose.model('Scenario', ScenarioSchema);

/*
var mongoose = require('mongoose');
var searchPlugin = require('mongoose-search-plugin');

var scenarioSchema = new mongoose.Schema({
    title: String,
    text: String,
    owner: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

scenarioSchema.plugin(searchPlugin, {
    fields: ['title', 'text']
});

// Chekfs, if the given user is the owner of the scenario
scenarioSchema.methods.hasOwner = function(user) {
    return (user.uuid === this.owner);
};

module.exports = mongoose.model('Scenario', scenarioSchema);
*/
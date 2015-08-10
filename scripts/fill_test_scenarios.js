// search.js
var $ = require('jquery');
var fs = require('fs');
var Scenario = require('../models/scenario.js');
var scenarioDir = __dirname + '/test_scenarios/';

var files = fs.readdirSync(scenarioDir);
files.forEach(function(file) {
  var json = fs.readFileSync(scenarioDir + file);
  console.log(JSON.parse(json));
});

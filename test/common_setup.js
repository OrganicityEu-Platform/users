var fs       = require('fs');
var Scenario = require('../models/schema/scenario.js');
var User     = require('../models/schema/user.js');
var Promise  = require('promise');
var moment   = require('moment');

var errorHandlerWrapper = function(success) {
  return function(err) {
    if (err) {
      done(err);
      console.log(err.stack);
      return;
    }
    success();
  };
};

var saveModels = function(models, done) {
  if (models.length === 0) {
    done();
    return;
  }
  models[0].save(function(err, saved) {
    if (err) {
      done(err);
      return;
    }
    saveModels(models.slice(1), done);
  });
};

var readJsonFilesFromDir = function(dir) {
  var files = fs.readdirSync(dir);
  var docs = [];
  files.forEach(function(file) {
    docs.push(JSON.parse(fs.readFileSync(dir + file)));
  });
  return docs;
};

/**
 * Reads a set of Json documents
 * @param {string[]} fileArr - an array of file names
 * @return {object[]} - the JavaScript objects containing the Json read from the disk
 */
var readJsonFiles = function(fileArr) {
  return fileArr.map(function(file) {
    return JSON.parse(fs.readFileSync(file));
  });
};

module.exports = {
  errorHandlerWrapper : errorHandlerWrapper,
  saveModels : saveModels,
  readJsonFilesFromDir : readJsonFilesFromDir,
  readJsonFiles : readJsonFiles
};

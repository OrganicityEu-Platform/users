var fs       = require('fs');
var Scenario = require('../models/scenario.js');
var User     = require('../models/userSchema.js');
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

/**
 * Loads users from the data/users/ subdirectory.
 * @param {string[]} usersToLoad - array of user UUID, corresponding to filenames in data/users subdirectory
 * @return {object[]} - an array containing user objects
 */
var loadUsers = function(usersToLoad) {
  return usersToLoad
    .map(function(user) { return __dirname + '/data/users/' + user + '.json'; })
    .map(function(fn) { return JSON.parse(fs.readFileSync(fn)); });
};

/**
 * Inserts user documents into the users collection.
 * @param {object[]} users - array of user objects
 * @return {Promise} promise that get's resolved (empty content) when inserted successfully or rejected (on error)
 */
var insertUsers = function(users) {
  return new Promise(function(resolve, reject) {
    var userModels = users.map(function(user) {
      return new User(user);
    });
    saveModels(userModels, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  errorHandlerWrapper  : errorHandlerWrapper,
  saveModels           : saveModels,
  readJsonFilesFromDir : readJsonFilesFromDir,
  readJsonFiles        : readJsonFiles,
  loadUsers            : loadUsers,
  insertUsers          : insertUsers
};

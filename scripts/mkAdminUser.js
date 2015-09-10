// mkAdminUser.js

var mongoose = require('mongoose');
var configDB = require('../config/database.js');
var uuid = require('node-uuid');
var crypto = require('crypto');

var User = require('../models/schema/user.js');

if (!process.argv[2]) {
  console.error('No Username given!');
  process.exit();
}

mongoose.connect(configDB.url); // connect to our database

var password = crypto.randomBytes(5).toString('hex');

var newUser    = new User();
newUser.uuid   = uuid.v4();
newUser.roles = ['admin'];
newUser.local.email = process.argv[2];
newUser.local.password = newUser.generateHash(password);

User.findOne({ 'local.email' :  newUser.local.email }, function(err, user) {
  // if there are any errors, return the error
  if (err) {
    console.log('ERROR', err);
    process.exit();
  }

  // check to see if theres already a user with that email
  if (user) {
    console.error('That username/email is already taken.');
    process.exit();
  } else {
    newUser.save(function(err) {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('User: ' + newUser.local.email);
        console.log('Password: ' + password);
      }
      process.exit();
    });

  }
});


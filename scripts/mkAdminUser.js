// mkAdminUser.js

var mongoose = require('mongoose');
var configDB = require('../config/database.js');
var uuid = require('node-uuid');
var crypto = require('crypto');

var User = require('../models/userSchema.js');

mongoose.connect(configDB.url); // connect to our database

var token = crypto.randomBytes(5).toString('hex');

var newUser    = new User();
newUser.uuid   = uuid.v4();
newUser.roles = ['admin'];
newUser.local.email    = 'admin@admin';
newUser.local.password = newUser.generateHash(token);
newUser.save(function(err) {
  if (err) {
    console.log('Error', error);
  } else {
    console.log('User: admin2');
    console.log('Password: ' + token);
  }
  process.exit();
});

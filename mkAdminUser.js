// server.js

var mongoose = require('mongoose');
var configDB = require('./config/database.js');
var uuid = require('node-uuid');
var crypto = require('crypto');

var User = require('./models/user.js');

mongoose.connect(configDB.url); // connect to our database

var token = crypto.randomBytes(5).toString('hex');

var newUser    = new User();
newUser.uuid   = uuid.v4();
newUser.roles = ["admin"];
newUser.local.email    = "admin";
newUser.local.password = newUser.generateHash(token);
newUser.save(function(err) {
    if (err) {
        console.log("Error", error);
    } else {
        console.log("User: admin");
        console.log("Password: " + token);
    }
    process.exit()
});



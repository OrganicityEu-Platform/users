// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    uuid         : String,
    local            : {
        email        : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        displayName  : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    github           : {
        id           : String,
        token        : String,
        username     : String,
        displayName  : String
    },
    roles : [String]
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.hasRole = function(roles) {
    for(var i = 0; i<=roles.length; i++) {
        var role = roles[i];
        if (this.roles.indexOf(role) >= 0) {
            return true;
        }
    }
    return false;
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

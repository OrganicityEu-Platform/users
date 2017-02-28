var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var user = mongoose.Schema({
  uuid     : String,
  location : String,
  gender   : String,
  roles    : [String], // ???
  profession : [String],
  interests : [String],
  birthdate : Date,
  professionTitle : String,
  publicEmail : String,
  publicWebsite : String,
  avatar   : String, // REMOVE
  oauth2           : {
    id           : String,
    token        : String,
    username     : String,
    displayName  : String,
    public       : { type: Boolean, default: false }
  },
  /*
  local            : {
    email        : String,
    password     : String,
    passwordReset : {
      id : String,
      timestamp : Date
    }
  },
  facebook         : {
    id           : String,
    token        : String,
    email        : String,
    name         : String,
    displayName  : String,
    public       : { type: Boolean, default: false }
  },
  twitter          : {
    id           : String,
    token        : String,
    displayName  : String,
    username     : String,
    public       : { type: Boolean, default: false }
  },
  google           : {
    id           : String,
    token        : String,
    email        : String,
    name         : String,
    public       : { type: Boolean, default: false }
  },
  github           : {
    id           : String,
    token        : String,
    username     : String,
    displayName  : String,
    public       : { type: Boolean, default: false }
  },
  disqus           : {
    id           : String,
    token        : String,
    email        : String,
    name         : String,
    public       : { type: Boolean, default: false }
  },
  */
});

/*
// generate a hash
user.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checks if password is valid
user.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};
*/

// Remove internal data from json
user.methods.json = function() {

  var o = this.toObject();

  delete o._id;
  delete o.__v;

  if (o.local) {
    delete o.local.password;
    delete o.local.passwordReset;
  }

  if (o.twitter) {
    delete o.twitter.token;
  }

  if (o.facebook) {
    delete o.facebook.token;
  }

  if (o.google) {
    delete o.google.token;
  }

  if (o.github) {
    delete o.github.token;
  }

  if (o.disqus) {
    delete o.disqus.token;
  }

  return o;
};

user.methods.hasRole = function(roles) {
  for (var i = 0; i <= roles.length; i++) {
    var role = roles[i];
    if (this.roles.indexOf(role) >= 0) {
      return true;
    }
  }
  return false;
};

var User = mongoose.model('User', user);

User.excludeFields = {
  '_id'            : 0,
  '__v'            : 0,
  'local.password' : 0
};

module.exports = User;

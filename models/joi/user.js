var Joi = require('joi');

var user = {};

// @see http://stackoverflow.com/a/29829152/605890
user.signupClient = {
  email           : Joi.string().email().label('E-Mail').required(),
  password        : Joi.string().min(6).label('Password').required(),
  password_repeat : Joi.any().label('Repeat Password').valid(Joi.ref('password')).required().options(
                      { language: { any: { allowOnly: 'must match Password' } } }
                    )
};

user.signupServer = {
  options : {
    allowUnknownBody: false
  },
  body: {
    email    : Joi.string().email().label('E-Mail').required(),
    password : Joi.string().min(6).label('Password').required(),
  }
};

module.exports = user;

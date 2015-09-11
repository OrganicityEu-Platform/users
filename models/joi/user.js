var Joi = require('joi');

var user = {};

var joiMail = Joi.string().email().label('E-Mail').required();
var joiPassword = Joi.string().min(6).label('Password').required();

// @see http://stackoverflow.com/a/29829152/605890
user.signupClient = {
  email           : joiMail,
  password        : joiPassword,
  password_repeat : Joi.any().label('Repeat Password').valid(Joi.ref('password')).required().options(
                      { language: { any: { allowOnly: 'must match Password' } } }
                    )
};

user.emailAndPassword = {
  email           : joiMail,
  password        : joiPassword
};

user.emailAndPasswordServer = {
  options : {
    allowUnknownBody: false
  },
  body: user.emailAndPassword
};

module.exports = user;

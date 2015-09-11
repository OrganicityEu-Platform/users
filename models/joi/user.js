var Joi = require('joi');

var user = {};

user.signup = {
  email           : Joi.string().email().label('E-Mail').required(),
  password        : Joi.string().min(6).label('Password').required(),
  password_repeat : Joi.any().label('Repeat Password').valid(Joi.ref('password')).required().options(
                      { language: { any: { allowOnly: 'must match Password' } } }
                    )
};

module.exports = user;

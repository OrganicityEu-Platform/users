var Joi = require('joi');

var user = {};

var joiMail = Joi.string().email().label('E-Mail').required();
var joiPassword = Joi.string().min(6).label('Password').required();
var joiPasswordRepeat = Joi.any().label('Repeat Password').valid(
  Joi.ref('password')
).required().options(
  { language: { any: { allowOnly: 'must match Password' } } }
);

// @see http://stackoverflow.com/a/29829152/605890
user.signupClient = {
  email           : joiMail,
  password        : joiPassword,
  password_repeat : joiPasswordRepeat
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

user.profile = {
  name   : Joi.string().label('Name'),
  gender : Joi.string().valid('m', 'f').label('Gender').options(
    { language: { any: { allowOnly: 'must be Male or Female' } } }
  ),
  roles  : Joi.array().items(Joi.string().valid('admin', 'moderator')) // .label('Roles')
};

user.profileServer = {
  options : {
    allowUnknownBody: false
  },
  body: user.profile
};
user.profileServer.body.local = {
  password: joiPassword.optional().allow('')
};

/*
user.profileClient = user.profile;
user.profileClient.local = Joi.object().keys({
  password        : joiPassword.optional().allow(''),
  password_repeat : joiPasswordRepeat.optional()
});
*/

// Issue
// (a) Array validation fails  -> no roles!
// (b) Nested validation fails -> password not nested to `local`
// @see: https://github.com/jurassix/react-validation-mixin/issues/38
user.profileClient = {
  name   : Joi.string().label('Name'),
  gender : Joi.string().valid('m', 'f').label('Gender').options(
    { language: { any: { allowOnly: 'must be Male or Female' } } }
  ),
  //roles : Joi.array().items(Joi.string().valid('admin', 'moderator')), // .label('Roles')
  password        : joiPassword.optional().allow(''),
  password_repeat : joiPasswordRepeat.optional()
};

module.exports = user;

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

user.image = {
  'type'   : Joi.string().valid('image/jpeg', 'image/png').label('Image file type').options(
    { language: { any: { allowOnly: 'must be a JPEG or PNG' } } }
  ),
  'width'  : Joi.number().integer().min(64).label('Width'),
  'height' : Joi.any().label('Height').valid(
      Joi.ref('width')
    ).required().options(
      { language: { any: { allowOnly: 'and width must be the same' } } }
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

user.forgotPassword = {
  email: joiMail
};

user.forgotPasswordServer = {
  options : {
    allowUnknownBody: false
  },
  body: user.forgotPassword
};

user.updatePassword = {
  id              : Joi.string(),
  password        : joiPassword,
  password_repeat : joiPasswordRepeat
};

user.updatePasswordServer = {
  options : {
    allowUnknownBody: false
  },
  body: {
    id              : Joi.string(),
    password        : joiPassword,
  }
};

user.profile = {
  // Mongo
  city : Joi.string().trim().allow(null).label('City').optional(),
  country : Joi.string().trim().label('Country').required(),
  profession : Joi.array().min(1).label('Profession').items(Joi.string()),
  professionTitle : Joi.string().allow(null).optional(),
  interests : Joi.array().min(1).label('Interests').items(Joi.string()),
  gender : Joi.string().valid('m', 'f', 'o').label('Gender').options(
    { language: { any: { allowOnly: 'must be Male or Female' } } }
  ),
  publicEmail : Joi.string().allow(null).trim().allow('').email().optional(),
  publicWebsite : Joi.string().allow(null).trim().allow('').optional(),
  birthday: Joi.date().allow(null).iso().label('Birthday').optional(),

  // Keycloak
  username   : Joi.string().label('Name').required(),
  firstName   : Joi.string().label('First Name').required(),
  lastName   : Joi.string().label('Last Name').required(),
  email : Joi.string().email().required(), // VALIDATE TYPE MAIL !!!
};

/*
roles  : Joi.array().items(Joi.string().valid('admin', 'moderator')).label('Roles').options(
  { language: { any: { allowOnly: 'must be `admin` and/or `moderator`' } } }
),
local : {
  password: joiPassword.optional().allow('')
},
*/

user.profileServer = {
  options : {
    allowUnknownBody: false
  },
  body: user.profile
};

// React side needs to check the repeated password as well!
user.profileClient = user.profile;
//user.profileClient.local.password_repeat = joiPasswordRepeat.optional();

module.exports = user;

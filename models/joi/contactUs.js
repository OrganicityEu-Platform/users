var Joi = require('joi');

var form = {
  name: Joi.string().label('Name').min(3).max(60).required(),
  address: Joi.string().email().label('Email Address').required(),
  subject: Joi.string().label('Subject').max(140).required(),
  body: Joi.string().label('Message').required()
};

module.exports = {
  form: form
};

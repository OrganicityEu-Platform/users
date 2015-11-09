var Joi = require('joi');

var form = {
  address: Joi.string().email().label('Email Address').required(),
  message: Joi.string().label('Message').required()
};

module.exports = {
  form: form
};

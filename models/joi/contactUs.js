var Joi = require('joi');

var contactUs = {};

contactUs.form = {
  options : {
    allowUnknownBody: false
  },
  body: {
    address: Joi.string().email().label('Email Address').required(),
    message: Joi.string().label('Message').required()
  }
};

module.exports = contactUs;


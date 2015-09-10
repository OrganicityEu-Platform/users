var Joi = require('joi');

var user = {};

user.a = {
  limit: Joi.types.Number().integer().min(1).max(25),
  offset: Joi.types.Number().integer().min(0).max(25),
  name: Joi.types.String().alphanum().min(2).max(25)
};

user.b = {
  userId: Joi.types.String().alphanum().min(10).max(20),
  name: Joi.types.String().min(3).max(50)
};

module.exports = user;

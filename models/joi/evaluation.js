var Joi = require('joi');

var EvaluationUpdate = {
  scenario  : Joi.object().keys({
    uuid    : Joi.string().required(),
    version : Joi.number().min(0).required()
  }),
  submitted : Joi.boolean().required(),
  answers   : Joi.array().items(Joi.object().keys({
    question : Joi.object().keys({
      uuid   : Joi.string().required(),
      tech   : Joi.boolean().required(),
      text   : Joi.string().required(),
      values : Joi.array().items(Joi.string()).required()
    }),
    answer : Joi.string()
  })),
  comment : Joi.string()
};

module.exports = {
  options : {
    allowUnknownBody: false
  },
  body : EvaluationUpdate
};

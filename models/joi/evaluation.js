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
      values : Joi.array().items(Joi.object().keys({
        value  : Joi.string().required(),
        weight : Joi.number().required()
      }))
    }),
    answer : Joi.object().keys({
      value  : Joi.string().required(),
      weight : Joi.number().required()
    })
  })),
  comment : Joi.string()
};

module.exports = {
  options : {
    allowUnknownBody: false
  },
  body : EvaluationUpdate
};

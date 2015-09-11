var Joi = require('joi');

var scenario = {};

scenario.step1 = {
  title       : Joi.string().label('Title').required(),
  summary     : Joi.string().label('Summary').required(),
  narrative   : Joi.string().label('Narrative').required()
};

scenario.step5 = {
  title       : Joi.string().label('Title').required(),
  summary     : Joi.string().label('Summary').required(),
  narrative   : Joi.string().label('Narrative').required(),
  actors      : Joi.array().label('Actors').items(Joi.string()),
  sectors     : Joi.array().label('Sectors').items(Joi.string()),
  devices     : Joi.array().label('Devices').items(Joi.string()),
  dataSources : Joi.array().label('Data Sources').items(Joi.string())
};

scenario.createOrUpdate = {
  options : {
    allowUnknownBody: false
  },
  body: scenario.step5
};

module.exports = scenario;

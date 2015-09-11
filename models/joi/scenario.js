var Joi = require('joi');

var scenario = {};

var joiTitle = Joi.string().label('Title').required();
var joiSummary = Joi.string().label('Summary').required();
var joiNarrative = Joi.string().label('Narrative').required();

scenario.step1 = {
  title       : joiTitle,
  summary     : joiSummary,
  narrative   : joiNarrative
};

scenario.step5 = {
  title       : joiTitle,
  summary     : joiSummary,
  narrative   : joiNarrative,
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

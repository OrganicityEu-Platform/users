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

// FIXME: use an object!
// https://github.com/jurassix/react-validation-mixin/issues/47
scenario.step5 = {
  'thumbnail_height' : Joi.number().integer().min(600).max(800).label('Height').required(),
  'thumbnail_width' : Joi.number().integer().min(1140).max(1140).label('Width').required(),
  'thumbnail_type' : Joi.string().valid('image/jpeg').label('File type').options(
    { language: { any: { allowOnly: 'must be a JPEG' } } }
  ).required()
};

/*
  thumbnail : {
    width  : Joi.number().required(),
    height : Joi.number().required()
  }
*/

scenario.step6 = {
  title       : joiTitle,
  summary     : joiSummary,
  narrative   : joiNarrative,
  actors      : Joi.array().label('Actors').items(Joi.string()),
  sectors     : Joi.array().label('Sectors').items(Joi.string()),
  devices     : Joi.array().label('Devices').items(Joi.string()),
  dataSources : Joi.array().label('Data Sources').items(Joi.string()),
  thumbnail   : Joi.string().required()
};

// Same as step6, but without thmbnail!
scenario.server = {
  title       : joiTitle,
  summary     : joiSummary,
  narrative   : joiNarrative,
  actors      : Joi.array().label('Actors').items(Joi.string()),
  sectors     : Joi.array().label('Sectors').items(Joi.string()),
  devices     : Joi.array().label('Devices').items(Joi.string()),
  dataSources : Joi.array().label('Data Sources').items(Joi.string()),
};

scenario.createOrUpdate = {
  options : {
    allowUnknownBody: false
  },
  body: scenario.server
};

module.exports = scenario;

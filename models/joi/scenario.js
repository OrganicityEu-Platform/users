var Joi             = require('joi');
var ScenarioConfig  = require('../../config/scenario.js');

var scenario = {};

var joiTitle = Joi.string().max(ScenarioConfig.max.title).label('Title').required();
var joiSummary = Joi.string().max(ScenarioConfig.max.summary).label('Summary').required();
var joiNarrative = Joi.string().max(ScenarioConfig.max.narrative).label('Narrative').required();

/*
  FIXME: use an object!
  thumbnail : {
    width  : Joi.number().required(),
    height : Joi.number().required()
  }
*/
// https://github.com/jurassix/react-validation-mixin/issues/47

scenario.image = {
  'width'  : Joi.number().integer().min(1140).label('Width'),
  'type'   : Joi.string().valid('image/jpeg', 'image/png').label('Image file type').options(
    { language: { any: { allowOnly: 'must be a JPEG or PNG' } } }
  )
};

scenario.edit = {
  title              : joiTitle,
  summary            : joiSummary,
  narrative          : joiNarrative,
  thumbnail          : Joi.string().regex(/^uploads\/|^tmp\//),
  image              : Joi.string().regex(/^uploads\/|^tmp\//)
};

scenario.preview = {
  title       : joiTitle,
  summary     : joiSummary,
  narrative   : joiNarrative,
  actors      : Joi.array().label('Actors').items(Joi.string()),
  sectors     : Joi.array().label('Sectors').items(Joi.string()),
  devices     : Joi.array().label('Devices').items(Joi.string()),
  credit      : Joi.string().label('Credit').optional(),
  copyright   : Joi.string().label('Copyright').optional(),
  dataSources : Joi.array().label('Data Sources').items(Joi.string()),
  thumbnail   : Joi.string().regex(/^uploads\/|^tmp\//),
  image       : Joi.string().regex(/^uploads\/|^tmp\//)
};

// Same as step6, but without thmbnail!
scenario.server = {
  title       : joiTitle,
  summary     : joiSummary,
  narrative   : joiNarrative,
  actors      : Joi.array().label('Actors').items(Joi.string()),
  sectors     : Joi.array().label('Sectors').items(Joi.string()),
  devices     : Joi.array().label('Devices').items(Joi.string()),
  credit      : Joi.string().label('Credit').optional(),
  copyright   : Joi.string().label('Copyright').optional(),
  dataSources : Joi.array().label('Data Sources').items(Joi.string()),
  thumbnail   : Joi.string().regex(/^uploads\/|^tmp\//),
  image       : Joi.string().regex(/^uploads\/|^tmp\//)
};

scenario.createOrUpdate = {
  options : {
    allowUnknownBody: false
  },
  body: scenario.server
};

module.exports = scenario;

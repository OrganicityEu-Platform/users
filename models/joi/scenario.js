var Joi = require('joi');

var scenario = {};

var joiTitle = Joi.string().label('Title').required();
var joiSummary = Joi.string().label('Summary').required();
var joiNarrative = Joi.string().label('Narrative').required();

/*
  FIXME: use an object!
  thumbnail : {
    width  : Joi.number().required(),
    height : Joi.number().required()
  }
*/
// https://github.com/jurassix/react-validation-mixin/issues/47

scenario.thumbnail = {
  'thumbnail_width'  : Joi.number().integer().min(1140).label('Width'),
  'thumbnail_type'   : Joi.string().valid('image/jpeg').label('File type').options(
    { language: { any: { allowOnly: 'must be a JPEG' } } }
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
  credit      : Joi.string().label('Credit/Copyright'),
  copyright   : Joi.string().label('Copyright'),
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
  credit      : Joi.string().label('Credit/Copyright'),
  copyright   : Joi.string().label('Copyright'),
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

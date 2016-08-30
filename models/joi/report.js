var Joi           = require('joi');
var ReportConfig  = require('../../config/report.js');

var report = {};

var joiTitle = Joi.string().max(ReportConfig.max.title).trim().label('Title').required();
var joiAbstract = Joi.string().max(ReportConfig.max.abstract).trim().label('Abstract').required();

/*
  FIXME: use an object!
  thumbnail : {
    width  : Joi.number().required(),
    height : Joi.number().required()
  }
*/
// https://github.com/jurassix/react-validation-mixin/issues/47

report.image = {
  'width'  : Joi.number().integer().min(1140).label('Width'),
  'type'   : Joi.string().valid('image/jpeg', 'image/png').label('Image file type').options(
    { language: { any: { allowOnly: 'must be a JPEG or PNG' } } }
  )
};

report.preview = {
  title           : joiTitle,
  abstract        : joiAbstract,
  thumbnail       : Joi.string().regex(/^uploads\/|^tmp\//),
  image           : Joi.string().regex(/^uploads\/|^tmp\//),
};

report.submit = {
  title         : joiTitle,
  abstract      : joiAbstract,
  domains       : Joi.array().label('Domains').items(Joi.string()),
  areas         : Joi.array().label('Areas').items(Joi.string()),
  organizations : Joi.array().label('Organizations').items(Joi.string()),
  orgtypes      : Joi.array().label('Organization Types').items(Joi.string()),
  types         : Joi.array().label('Report Types').items(Joi.string()),
  approaches    : Joi.array().label('Approaches').items(Joi.string()),
  tags          : Joi.array().label('Report tags').items(Joi.string()),
  credit        : Joi.string().trim().min(1).label('Credit').optional(),
  copyright     : Joi.string().trim().min(1).label('Copyright').optional(),
  thumbnail     : Joi.string().regex(/^uploads\/|^tmp\//),
  image         : Joi.string().regex(/^uploads\/|^tmp\//),
  url           : Joi.string().trim().label('URL').optional(),
};

report.createOrUpdate = {
  options : {
    allowUnknownBody: false
  },
  body: report.submit
};

module.exports = report;

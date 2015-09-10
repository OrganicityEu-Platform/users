var Joi = require('joi');

var scenario = {};

scenario.createOrUpdate = {
  options : {
    allowUnknownBody: false
  },
  body: {
    title       : Joi.string().required(),          // plain text
    summary     : Joi.string().required(),          // plain text
    narrative   : Joi.string().required(),          // markdown
    actors      : Joi.array().items(Joi.string()),  // tags (comma-separated)
    sectors     : Joi.array().items(Joi.string()),  // tags (comma-separated)
    devices     : Joi.array().items(Joi.string()),  // tags (comma-separated)
    dataSources : Joi.array().items(Joi.string())   // uuids of data source type
  }
};

module.exports = scenario;

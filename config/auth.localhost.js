/*
 * Configurations for auths
 */

var config = require('../config/config');
var api     = require('../api_routes.js');

module.exports = {
  'facebookAuth' : {
    'clientID'         : '131530127187026', // your App ID
    'clientSecret'     : '94e0cfde0be3d3b119bc4dbbaa8b3c1f', // your App Secret
    'callbackURL'      : config.host + ':' + config.port + api.route('callback_facebook')
  },
  'twitterAuth' : {
    'consumerKey'      : '4rpDU6Z2gWFsX8rVMAuFLZDX7',
    'consumerSecret'   : 'UbvoVVuzUr6EOcgUNhsv9D3kod9oMvOFFwtFuA5vmyxfCKBTSh',
    'callbackURL'      : config.host + ':' + config.port + api.route('callback_twitter')
  },
  'googleAuth' : {
    'clientID'         : '89215756602-8e9a0t2go3ha3gmkopo0r64loehuvh3h.apps.googleusercontent.com',
    'clientSecret'     : 'CFPuPZa7l6YMFBBhXqgsRFlO',
    'callbackURL'      : config.host + ':' + config.port + api.route('callback_google')
  },
  'githubAuth' : {
    'clientID'         : '646b3c1643b20170b3bb',
    'clientSecret'     : '4117fc5d93c7e3e5065a01508f943758ba2f4365',
    'callbackURL'      : config.host + ':' + config.port + api.route('callback_github')
  },
  'disqusAuth' : {
    'clientID'         : 'CTbb7OOYpeXfyi9TKHdlfr13W2hTbxrGkQvVSvQrur241tB6Mz1y8G3dfJMMtnWt',
    'clientSecret'     : '0N4wQA4Jq6gjVuebTcNTBldmlAtXz7mxYoF2SE56qHHGCfAFa36LxpfsjugnovbG',
    'callbackURL'      : config.host + ':' + config.port + api.route('callback_disqus')
  },
  'disqusAuthProduction' : {
    'clientID'         : 'S3JTOsRJBiVXmz24MR0S94w5jC8jfk9XPEG4GfGiYeAjexDstUKfEqS7XlEDSeLF',
    'clientSecret'     : '3uA1p9myEspmmxannqYUogYRELJXBY7aHsKh4rhxe29KZskwMeGi7q5YKhpF1PyP',
    'callbackURL'      : config.host + ':' + config.port + api.route('callback_disqus')
  },
  'oAuth2' : {
    'clientID'         : 'scenarios',
    'clientSecret'     : null,
    'callbackURL'      : config.host + ':' + config.port + api.route('callback_oauth2'),
    'authorizationURL' : 'https://accounts.organicity.eu/realms/organicity/protocol/openid-connect/auth',
    'tokenURL'         : 'https://accounts.organicity.eu/realms/organicity/protocol/openid-connect/token'
  }
};

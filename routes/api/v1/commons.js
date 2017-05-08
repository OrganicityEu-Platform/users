var config      = require('../../../config/config.js');
var httpClient  =  require('../../../lib/HTTPClient.js');

module.exports = {
  getAccessToken : function(req, res, next) {
    var optionsCall = {
      protocol: config.accounts_token_endpoint.protocol,
      host: config.accounts_token_endpoint.host,
      port: config.accounts_token_endpoint.port,
      path: config.accounts_token_endpoint.path,
      method: 'POST',
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    };

    var payload = 'grant_type=client_credentials&client_id=' +
      config.client_id +
      '&client_secret=' +
      config.client_secret;

    httpClient.sendData(optionsCall, payload, res, function(status, responseText, headers) {
      var token = JSON.parse(responseText);
      var access_token = token.access_token;
      req.access_token = access_token;
      next();
    },function(status, resp) {
      console.error('ERROR!');
      console.log('Internal error message. Status: ', status, 'Response: ', resp);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.send('An Internal Server Error happended!'); // FIXME: use OC createError
    });
  }
};

var https         = require('https');
var redis         = require('redis').createClient();
var config        = require('../config/config.js');

// 4,5 Minutes
var timeAccessToken = ((4 * 60) + 30);

module.exports = function(callback) {

  console.time('Get token');

  redis.get('oc.users.accessToken', function(err, reply) {
    if (err || !reply) {
      console.log('No access token in cache. Renew token!');

      var payload = 'grant_type=client_credentials' +
          '&client_id=' + config.client_id +
          '&client_secret=' + config.client_secret;

      var options = {
        host: 'accounts.organicity.eu',
        path: '/realms/organicity/protocol/openid-connect/token',
        port: 443,
        method: 'POST',
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      // Call roles endpoint to get the subs for the corresponding role name
      var req = https.request(options, function(res) {
        var str = '';
        res.on('data', function(chunk) {
          str += chunk;
        });

        res.on('end', function() {
          var json = JSON.parse(str);
          console.timeEnd('Get token');
          redis.setex('oc.users.accessToken', timeAccessToken, json.access_token, function() {
            callback(json.access_token);
          });

        });
      });

      req.write(payload);
      req.end();

      req.on('error', function(e) {
        console.error(e);
      });

    } else {
      console.log('Access token in cache. Reuse!');
      callback(reply.toString());
    }
  });
};
var getToken  = require('./GetToken.js');
var https     = require('https');

var addRole = function(sub, role, callback, error) {
  console.log('Add role ', role);

  getToken(function(token) {
    // Add experimenter role
    var body = {
      role: role
    };
    var payload = JSON.stringify(body);

    var options = {
      host: 'accounts.organicity.eu',
      path: '/permissions/users/' + sub + '/roles',
      port: 443,
      method: 'POST',
      headers: {
        'Authorization'  : ' Bearer ' + token,
        'Content-Type'   : 'application/json',
        'Content-Length' : payload.length
      }
    };


    var callApi = https.request(options, function(res) {

      var str = '';
      res.on('data', function(chunk) {
        str += chunk;
      });

      res.on('end', function() {
        if (res.statusCode === 201) {
          callback();
        } else {
          console.log('Wrong status code');
          error();
        }
      });
    });
    callApi.write(payload);
    callApi.end();

    callApi.on('error', function(e) {
      console.log('Another error happended!');
      error();
    });
  });
};

var removeRole = function(sub, role, callback, error) {

  console.log('Remove role', role);

  getToken(function(token) {

    var options = {
      host: 'accounts.organicity.eu',
      path: '/permissions/users/' + sub + '/roles/' + role,
      port: 443,
      method: 'DELETE',
      headers: {
        'Authorization'  : ' Bearer ' + token
      }
    };
    var callApi = https.request(options, function(res) {

      var str = '';
      res.on('data', function(chunk) {
        str += chunk;
      });

      res.on('end', function() {
        console.log(res.statusCode);
        if (res.statusCode === 200) {
          callback();
        } else {
          error();
        }
      });
    });
    callApi.end();

    callApi.on('error', function(e) {
      console.error(e);
    });

  });
};

var hasRole = function(sub, role, callback, error) {

  console.log('Has role', role);

  getToken(function(token) {

    var options = {
      host: 'accounts.organicity.eu',
      path: '/permissions/users/' + sub + '/roles/' + role,
      port: 443,
      method: 'GET',
      headers: {
        'Authorization'  : ' Bearer ' + token
      }
    };
    var callApi = https.request(options, function(res) {

      var str = '';
      res.on('data', function(chunk) {
        str += chunk;
      });

      res.on('end', function() {
        console.log(res.statusCode);
        if (res.statusCode === 200) {
          callback(true);
        } else {
          callback(false);
        }
      });
    });
    callApi.end();

    callApi.on('error', function(e) {
      console.error(e);
    });

  });
}

module.exports = {
  addRole: addRole,
  removeRole: removeRole,
  hasRole: hasRole
};
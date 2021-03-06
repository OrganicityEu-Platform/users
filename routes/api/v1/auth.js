var api         = require('../../../api_routes.js');
var ui          = require('../../../ui_routes.js');
var UserJoi     = require('../../../models/joi/user.js');

var validate    = require('express-validation');

var config      = require('../../../config/config.js');
var httpClient  = require('../../../lib/HTTPClient.js');

var commons     = require('./commons');

var RoleHandler   = require('../../../lib/RoleHandler.js');

var createError = function(error, description) {
  var o = {
    error: error,
    description: description
  };
  return JSON.stringify(o);
};

module.exports = function(router, passport) {

  // Must be here, because we do not have passport var earlier
  var isLoggedIn = require('../../../models/isLoggedIn.js')(passport);

  // PROFIL
  router.get(api.route('currentUser'), [isLoggedIn], commons.getAccessToken, function(req, res) {

    // If this function is reached,
    // a) the user was added to the local mongo database and the user data was updated
    // b) the token was aqcuired to get the user data from keycloak

    // STEP ONE:
    var userdata_mongo = req.user.json();
    console.log('1) Got User data from Mongo');
    //console.log('userdata_mongo: ', userdata_mongo);

    //var optionsCall = {
    //  protocol: config.accounts_token_endpoint.protocol,
    //  host: config.accounts_token_endpoint.host,
    //  port: config.accounts_token_endpoint.port,
    //  path: '/permissions/users/' + req.user.sub,
    //  method: 'GET',
    //  headers : {
    //    'Authorization' : 'Bearer ' + req.access_token,
    //    'Accept' : 'application/json'
    //  }
    //};

    //httpClient.sendData(optionsCall, undefined, res, function(status, responseText, headers) {
    //console.log('responseText2', responseText);
    //var userdata_keycloak = JSON.parse(responseText);

    RoleHandler.hasRole(userdata_mongo.sub, 'participant', function(isParticipant) {

      console.log('2) Got Participant role');

      var o = {
        uuid :              userdata_mongo.uuid,

        // Mongo
        city:               userdata_mongo.city,
        country:            userdata_mongo.country,
        profession:         userdata_mongo.profession,
        professionTitle:    userdata_mongo.professionTitle,
        interests:          userdata_mongo.interests,
        gender:             userdata_mongo.gender,
        publicEmail:        userdata_mongo.publicEmail,
        publicWebsite:      userdata_mongo.publicWebsite,
        birthday:           userdata_mongo.birthday,

        // Keycloak
        sub:                userdata_mongo.sub,
        firstName:          userdata_mongo.firstName,
        lastName:           userdata_mongo.lastName,
        email:              userdata_mongo.email,
        username:           userdata_mongo.username,

        participant:        isParticipant
      };

      return res.status(200).json(o);
    }, function() {
      res.status(500).send('Internal Server Error: Cannot add participant role');
    });

    //},  function(status, resp) {
    //  console.log('Internal error message. Status: ', status, 'Response: ', resp);
    //  res.statusCode = 500;
    //  res.setHeader('Content-Type', 'application/json');
    //  res.send(createError('InternalServerError', 'An Internal Server Error happended!'));
    //});

  });

  var authSuccess = function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect(ui.route('profile'));
    //console.log('SUCC');
  };
  var authCallbacks = {
    successRedirect : authSuccess, // redirect to the secure profile section
    failureRedirect : ui.route('local-lougin'), // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  };

  // process logout
  router.get(api.route('logout'), function(req, res) {
    req.logout();
    res.status(204).send();
  });

  /*
  // process the login form
  router.post(
    api.route('local-login'), [validate(UserJoi.emailAndPasswordServer)], function(req, res, next) {
      passport.authenticate('local-login', function(err, user, info) {
        if (err) {
          return next(err);
        }

        if (!user) {
          if (!info || !info.error) {
            return res.status(500).json({error: 'Local login failed due to an unknown error'});
          }
          // Here we log the `real` error
          console.log('Login failure: ', info);
          // Here we return a `generic` errior
          return res.status(422).json({error: 'Email address unknown and/or password wrong'});
        }

        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          return res.json(user.json());
        });
      })(req, res, next);
    }
  );

  // process the signup form
  router.post(api.route('signup'), [validate(UserJoi.emailAndPasswordServer)], function(req, res, next) {
      passport.authenticate('local-signup', function(err, user, info) {
        if (err) {
          return next(err);
        }

        if (!user) {
          if (!info || !info.error) {
            return res.status(500).json({error: 'Signup failed due to an unknown error'});
          }
          return res.status(422).json(info);

        }

        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          return res.json({
            uuid : user.uuid,
            name : user.name,
            roles : user.roles,
            gender : user.gender
          });
        });
      })(req, res, next);
    });
    */
  // =============================================================================
  // LOGIN USING OAUTH / OPEN ID CONNECT PROVIDERS ===============================
  // =============================================================================

  var authProviders = ['facebook', 'twitter', 'google', 'github', 'disqus', 'oauth2'];
  var authScopes = {
    /*
    'facebook' : { scope : ['email'] },
    'twitter'  : { scope : ['profile', 'email'] },
    'google'   : { scope : ['profile', 'email'] },
    'github'   : { scope : ['profile', 'email'] },
    'disqus'   : { scope : ['read', 'write', 'email'] },
    */
    'oauth2'   : { scope : ['profile', 'email'] },
  };

  // login / signup using auth providers
  authProviders.forEach(function(provider) {
    router.get(api.route('auth_' + provider), passport.authenticate(provider, authScopes[provider]));
    router.get(api.route('callback_' + provider), passport.authenticate(provider), authSuccess);
  });

  // authorize / connect accounts for already existing users
  authProviders.forEach(function(provider) {
    router.post(api.route('connect_' + provider), passport.authenticate(provider, authScopes));
    router.get(api.route('callback_' + provider), passport.authorize(provider, authCallbacks));
  });

  // special case: connecting local-login
  router.post(api.route('connect_local-signup'), passport.authenticate('local-signup', authScopes));

  return router;

};

var api = require('../../../api_routes.js');
var ui  = require('../../../ui_routes.js');

var validate     = require('express-validation');
var UserJoi  = require('../../../models/joi/user.js');

module.exports = function(router, passport) {

  router.get(api.route('currentUser'), function(req, res) {
    if (req.user) {
      res.json({
        uuid : req.user.uuid,
        name : req.user.name,
        roles : req.user.roles,
        gender : req.user.gender
      });
    } else {
      res.status(204).send();
    }
  });

  var authSuccess = function(req, res) {
    res.redirect(ui.route('profile'));
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

  // process the login form
  router.post(api.route('local-login'), [validate(UserJoi.emailAndPasswordServer)], function(req, res, next) {
      passport.authenticate('local-login', function(err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(422).send('Email address and/or password unknown');
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
  // process the signup form
  router.post(api.route('signup'), [validate(UserJoi.emailAndPasswordServer)], function(req, res, next) {
      passport.authenticate('local-signup', function(err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          console.error('Signup failed due to unknown error');
          return res.status(500).send('Signup failed');
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

  // =============================================================================
  // LOGIN USING OAUTH / OPEN ID CONNECT PROVIDERS ===============================
  // =============================================================================

  var authProviders = ['facebook', 'twitter', 'google', 'github', 'disqus'];
  var authScopes = {
    'facebook' : { scope : ['email'] },
    'twitter'  : { scope : ['profile', 'email'] },
    'google'   : { scope : ['profile', 'email'] },
    'github'   : { scope : ['profile', 'email'] },
    'disqus'   : { scope : ['read', 'write', 'email'] }
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

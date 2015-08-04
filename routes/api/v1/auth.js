var api = require('../../../api_routes.js');
var ui  = require('../../../ui_routes.js');

module.exports = function(router, passport) {

  router.get(api.route('currentUser'), function(req, res) {
    if (req.user) {
      res.json({
        uuid : req.user.uuid,
        name : req.user.name,
        roles : req.user.roles
      });
    } else {
      res.status(404).send("NOT FOUND");
    }
  });

  var authCallbacks = {
    successRedirect : ui.route('profile'), // redirect to the secure profile section
    failureRedirect : ui.route('local-login'), // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  };

  // process logout
  router.get(api.route('logout'), function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // process the login form
  router.post(api.route('local-login'), passport.authenticate('local-login', authCallbacks));
  // process the signup form
  router.post(api.route('signup'), passport.authenticate('local-signup', authCallbacks));

  // =============================================================================
  // LOGIN USING OAUTH / OPEN ID CONNECT PROVIDERS ===============================
  // =============================================================================

  var authProviders = ['facebook', 'twitter', 'google', 'github'];
  var authScopes = {
    'facebook' : { scope : ['email'] },
    'twitter'  : { scope : ['profile','email'] },
    'google'   : { scope : ['profile','email'] },
    'github'   : { scope : ['profile','email'] },
  };

  // login / signup using auth providers
  authProviders.forEach(function(provider) {
    router.get(api.route('auth_'+provider), passport.authenticate(provider, authScopes[provider]));
    router.get(ui.route('callback_'+provider), passport.authenticate(provider), function(req, res) {
      res.redirect(ui.route('profile'));
    });
  });

  // authorize / connect accounts for already existing users
  authProviders.forEach(function(provider) {
    router.post(api.route('connect_'+provider), passport.authenticate(provider, authScopes));
    router.get(ui.route('callback_'+provider), passport.authorize(provider, authCallbacks));
  });

  // special case: connecting local-login
  router.post(api.route('connect_local-signup'), passport.authenticate('local-signup', authScopes));

  return router;

};

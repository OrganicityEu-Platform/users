var prefixes = {
  'auth'       : '/auth',
  'sceanarios' : '/scenarios'
}

var routes = {

  // authentication routes
  'profile'           : prefixes.auth + '/profile',
  'local-login'       : prefixes.auth + '/local-login',
  'signup'            : prefixes.auth + '/signup',
  'callback_facebook' : prefixes.auth + '/facebook/callback',
  'callback_twitter'  : prefixes.auth + '/twitter/callback',
  'callback_google'   : prefixes.auth + '/google/callback',
  'callback_github'   : prefixes.auth + '/github/callback',

  // scenario routes

}

module.exports = {
  route : function(routeName) {
    if (!routes[routeName] || undefined === routes[routeName]) {
      console.log('No route for "%s" found!', routeName);
    }
    return routes[routeName];
  }
}

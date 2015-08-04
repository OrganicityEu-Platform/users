var prefixes = {
  'auth'       : '/auth',
  'sceanarios' : '/scenarios'
}

var routes = {

  // authentication routes
  'profile'      : '/auth/profile',
  'local-login'  : '/auth/local-login',
  'signup'       : '/auth/signup'

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

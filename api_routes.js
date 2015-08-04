var prefixes = {
  'auth'      : '/api/v1/auth',
  'users'     : '/api/v1/users',
  'scenarios' : '/api/v1/scenarios',
  'actors'    : '/api/v1/actors',
  'sectors'   : '/api/v1/sectors',
  'devices'   : '/api/v1/devices'
}

var routes = {

  // authentication routes
  'currentUser'          : prefixes.auth + '/currentUser',
  'local-login'          : prefixes.auth + '/local-login',
  'signup'               : prefixes.auth + '/signup',
  'auth_facebook'        : prefixes.auth + '/facebook',
  'auth_twitter'         : prefixes.auth + '/twitter',
  'auth_google'          : prefixes.auth + '/google',
  'auth_github'          : prefixes.auth + '/github',
  'connect_facebook'     : prefixes.auth + '/facebook',
  'connect_twitter'      : prefixes.auth + '/twitter',
  'connect_google'       : prefixes.auth + '/google',
  'connect_github'       : prefixes.auth + '/github',
  'connect_local-signup' : prefixes.auth + '/local',
  'login'                : prefixes.auth + '/login',
  'logout'               : prefixes.auth + '/logout',

  // users routes
  'users'                : prefixes.users + '/?',
  'user_by_uuid'         : prefixes.users + '/:uuid/?',
  'disconnect_local'     : prefixes.users + '/:uuid/unlink/local?',
  'disconnect_facebook'  : prefixes.users + '/:uuid/unlink/facebook?',
  'disconnect_twitter'   : prefixes.users + '/:uuid/unlink/twitter?',
  'disconnect_google'    : prefixes.users + '/:uuid/unlink/google?',
  'disconnect_github'    : prefixes.users + '/:uuid/unlink/github?',

  // scenario routes
  'scenario_list'        : prefixes.scenarios + '/?',
  'scenario_by_uuid'     : prefixes.scenarios + '/:uuid/?',
  'actors_list'          : prefixes.actors + '/?',
  'sectors_list'         : prefixes.sectors + '/?',
  'devices_list'         : prefixes.devices + '/?'
}

module.exports = {
  route : function(routeName) {
    if (!routes[routeName] || undefined === routes[routeName]) {
      console.log('No route for "%s" found!', routeName);
    }
    return routes[routeName];
  }
}

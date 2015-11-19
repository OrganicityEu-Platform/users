var config   = require('./config/config.js');
var routes   = require('./routes.js');

var ui_routes = {

  'root'                   : '/?',
  'home'                   : '/?',

  'contactUs' : '/contactUs/?',

  // scenario routes
  'scenarioList'           : '/scenarios/?',
  'scenarioCreate'         : '/scenarios/new/?',
  'scenarioEdit'           : '/scenarios/edit/:uuid/?',
  'scenarioView'           : '/scenarios/:uuid/?',
  'scenarioEvalView'       : '/scenarios/evaluate/:uuid/?',

  // User routes
  'userView'               : '/users/:uuid/?',

  // authentication routes
  'profile'                : '/auth/profile/?',
  'login'                  : '/auth/login/?',
  'logout'                 : '/auth/logout/?',
  'signup'                 : '/auth/signup/?',
  'forgot-password'        : '/auth/forgot-password/?',

  // Admin routes
  'sysinfo'                : '/sysinfo/?',
  'admin_userList'         : '/admin/users/?',
  'admin_userEdit'         : '/admin/users/:uuid/?',
  'admin_questionnaire'    : '/admin/questionnaire/?'
};

module.exports = {
  route   : routes.route(config.contextPath, ui_routes, { relative : false }),
  reverse : routes.reverse(config.contextPath, ui_routes, { relative : false }),
  asset   : routes.asset(config.contextPath, { relative : false })
};

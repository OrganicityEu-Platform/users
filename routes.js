var Route = require('route-parser');
var endsWith = require('./util/endsWith.js');

var route = function(contextPath, routes) {
  // ensure contextPath ends with /
  contextPath = endsWith(contextPath, '/') ? contextPath : contextPath + '/';
  // ensure contextPath starts with /
  contextPath = contextPath.substr(0, 1) == '/' ? contextPath : '/' + contextPath;
  return function(routeName) {
    if (!routes[routeName] || undefined === routes[routeName]) {
      return undefined;
    }
    var route = routes[routeName];
    route = contextPath + (route.substr(0, 1) == '/' ? route.substr(1) : route);
    return route;
  }
}

var reverse = function(contextPath, routes) {
  var routeFn = route(contextPath, routes);
  return function(routeName, params) {
    var unparsed = routeFn(routeName);
    if (!unparsed || unparsed === undefined) {
      return undefined;
    }
    var parsed = new Route(unparsed);
    var reverse = parsed.reverse(params);
    if (endsWith(reverse, '/?')) {
      return reverse.substr(0, reverse.length-2);
    }
    return reverse;
  };
}

var asset = function(contextPath) {
  // ensure contextPath ends with /
  contextPath = endsWith(contextPath, '/') ? contextPath : contextPath + '/';
  // ensure contextPath starts with /
  contextPath = contextPath.substr(0, 1) == '/' ? contextPath : '/' + contextPath;
  return function(path) {
    return contextPath + (path.substr(0, 1) == '/' ? path.substr(1) : path);
  }
}

module.exports = { route : route, reverse : reverse, asset : asset };

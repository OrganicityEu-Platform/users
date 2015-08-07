var Route = require('route-parser');
var endsWith = require('./util/endsWith.js');

var defaultOptions = {
  relative : false
};

var prefix = function(contextPath, options) {
  return function(suffix) {
    options = options || defaultOptions;
    // ensure contextPath is relative or absolute, depending on options
    if (options.relative) {
      if (contextPath == '/') {
        return suffix.substr(0, 1) == '/' ? suffix.substr(1) : suffix;
      } else {
        contextPath = contextPath.substr(0, 1) == '/' ? contextPath.substr(1) : contextPath;
      }
    } else { // absolute
      if (contextPath == '') {
        contextPath = '/';
      } else {
        contextPath = contextPath.substr(0, 1) == '/' ? contextPath : '/' + contextPath;
      }
    }
    // ensure contextPath ends with /
    contextPath = endsWith(contextPath, '/') ? contextPath : contextPath + '/';
    return contextPath + (suffix.substr(0, 1) == '/' ? suffix.substr(1) : suffix);
  }
}

var route = function(contextPath, routes, options) {
  var prefixFn = prefix(contextPath, options);
  return function(routeName) {
    if (!routes[routeName] || undefined === routes[routeName]) {
      return undefined;
    }
    return prefixFn(routes[routeName]);
  }
}

var reverse = function(contextPath, routes, options) {
  var routeFn = route(contextPath, routes, options || defaultOptions);
  return function(routeName, params) {
    var unparsed = routeFn(routeName);
    if (!unparsed || unparsed === undefined) {
      return undefined;
    }
    var parsed = new Route(unparsed);
    var reverse = parsed.reverse(params);
    if (!reverse) {
      return undefined;
    }
    if (endsWith(reverse, '/?')) {
      return reverse.substr(0, reverse.length-2);
    }
    return reverse;
  };
}

var asset = function(contextPath, options) {
  var prefixFn = prefix(contextPath, options);
  return function(path) {
    return prefixFn(path);
  }
}

module.exports = { route : route, reverse : reverse, asset : asset };


var UserLogic = {};

UserLogic.getMailAddress = function(user) {
  if (typeof user == 'undefined') {
    return '';
  }

  if (user.local) {
    return user.local.email;
  } else if (user.facebook) {
    return user.facebook.email;
  } else if (user.google) {
    return user.google.email;
  } else if (user.disqus) {
    return user.disqus.email;
  } else {
    return '';
  }
};

UserLogic.getName = function(user) {
  if (typeof user == 'undefined') {
    return '';
  }

  var isDefined = function(value) {
    return typeof value !== 'undefined' && value;
  };

  if (isDefined(user.name)) {
    return user.name;
  }
  else if (isDefined(user.local) && isDefined(user.local.email)) {
    // Fallback, as user.local does not define a separate name.
    return user.local.email;
  }
  else if (isDefined(user.facebook) && isDefined(user.facebook.name)) {
    return user.facebook.name;
  }
  else if (isDefined(user.twitter) && isDefined(user.twitter.displayName)) {
    return user.twitter.displayName;
  }
  else if (isDefined(user.google) && isDefined(user.google.name)) {
    return user.google.name;
  }
  else if (isDefined(user.github) && isDefined(user.github.displayName)) {
    return user.github.displayName;
  }
  else if (isDefined(user.disqus) && isDefined(user.disqus.name)) {
    return user.disqus.name;
  }

  return '<empty>';
};


module.exports = UserLogic;

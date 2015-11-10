

var getMailAddress = function(user) {
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

module.exports = {
  getMailAddress: getMailAddress
};

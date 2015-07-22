// see http://www.aaron-powell.com/posts/2015-01-15-authentication-on-react-components.html
var RoleRequiredMixin = {
  permitted: function(requiredRole) {
    if (undefined === window.currentUser || null == window.currentUser) {
      return false;
    }
    return currentUser.roles.indexOf(requiredRole) > -1;
  }
};

var UserHasRoleMixin = {
  userHasRole: function(requiredRole) {
    if (undefined === window.currentUser || null == window.currentUser) {
      return false;
    }
    return currentUser.roles.indexOf(requiredRole) > -1;
  }
};

export default UserHasRoleMixin;

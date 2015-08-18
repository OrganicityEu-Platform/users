/*
 * Checks, if a given user has one of the given roles
 */
// @Param roles:  an array
module.exports = function(roles) {
  return function(req, res, next) {
    if (req.user.hasRole(roles)) {
      return next();
    }
    res.send(403, 'Forbidden: User not in role!');
  };

};

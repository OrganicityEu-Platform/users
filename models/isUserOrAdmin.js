module.exports = function(passport) {
  return function(req, res, next) {
    if(req.user.hasRole(["admin"])) {
      return next();
    } else if(req.user.uuid == req.params.id) {
      return next();
    } else {
      // Other users are not allowed to edit anything!
      var err = new Error("Forbidden: Not allowed to edit User " + req.params.id);
      err.status = 403;
      return next(err);
    }
  };
}

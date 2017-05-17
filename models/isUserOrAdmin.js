module.exports = function(passport) {
  return function(req, res, next) {
    console.log('FOO');
    if (req.user.hasRole(['admin'])) {
      return next();
    } else if (req.user.uuid === req.params.uuid) {
      return next();
    } else {
      // Other users are not allowed to edit anything!
      var err = new Error('Forbidden: Not allowed to edit User ' + req.params.uuid);
      err.status = 403;
      return next(err);
    }
  };
};

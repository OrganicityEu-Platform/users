// route middleware to ensure user is logged in

module.exports = function(roles) {

    return function (req, res, next) {
        if(req.user.hasRole(roles)) {
            return next();
        }
        res.send(403, 'Forbidden: User not in role!');
    }

}


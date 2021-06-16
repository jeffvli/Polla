const passport = require("passport");

const checkAuthenticated = function (req, res, next) {
  passport.authenticate("jwt", function (err, user, info) {
    req.authenticated = !!user;
    next();
  })(req, res, next);
};

module.exports = checkAuthenticated;

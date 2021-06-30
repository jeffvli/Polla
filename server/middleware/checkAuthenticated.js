const passport = require("passport");
const errorMessage = require("../utils/errorMessage");

const checkAuthenticated = function (req, res, next) {
  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    req.authenticated = !!user;

    if (!req.authenticated && req.headers.authorization) {
      return res.status(401).json(errorMessage(401, "Invalid authorization."));
    }

    if (user) {
      req.user = { id: user.id, username: user.username };
    }

    next();
  })(req, res, next);
};

module.exports = checkAuthenticated;

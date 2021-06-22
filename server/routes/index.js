const users = require("./api/users");
const auth = require("./api/auth");
const polls = require("./api/polls");

module.exports = function (app) {
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/polls", polls);
};

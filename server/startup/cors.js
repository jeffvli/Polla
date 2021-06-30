const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: [
        `https://${process.env.APP_BASE_URL}`,
        `http://${process.env.APP_BASE_URL}`,
        `${process.env.APP_BASE_URL}`,
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true, // enable set cookie
    })
  );
};

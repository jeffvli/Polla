require("dotenv").config();

const express = require("express");
const app = express();
const expressip = require("express-ip");
const passport = require("passport");
require("./startup/passport-config");
require("./startup/cors")(app);

// Set the server and socket.io port
const port = process.env.PORT || 5000;

// Middleware
app.use(expressip().getIpInfoMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// Routes
require("./routes/index")(app);

app.listen(port, () => console.log(`Listening on *:${port}`));

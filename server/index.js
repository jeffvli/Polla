if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressip = require("express-ip");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.APP_BASE_URL,
    methods: ["GET", "POST"],
  },
});
const pollSockets = require("./sockets/polls");
const passportConfig = require("./passport-config");
require("./utils/initRedis");

// Set the server and socket.io port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(expressip().getIpInfoMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: process.env.APP_BASE_URL,
    credentials: true,
  })
);

app.use(passportConfig.initialize());

// Routes
app.use("/api/polls", require("./routes/api/polls"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));

io.on("connection", (socket) => {
  console.log("New client connected");
  let interval;

  if (interval) {
    clearInterval(interval);
  }

  const pollSlug = socket.handshake.query["pollSlug"];
  interval = setInterval(
    () => pollSockets.emitPollResults(socket, pollSlug),
    1000
  );

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = (socket) => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

server.listen(PORT, () => console.log(`Listening on *:${PORT}`));

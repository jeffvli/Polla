const express = require("express");
const app = express();
const expressip = require("express-ip");
const cors = require("cors");

const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const pollSockets = require("./sockets/polls");

// Set the server and socket.io port
const PORT = process.env.PORT || 5000;

app.use(expressip().getIpInfoMiddleware);
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/polls", require("./routes/api/polls"));

let interval;
io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => pollSockets.emitResponses(socket), 1000);
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

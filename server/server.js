const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");

const app = express();

const users = [{}];

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server Is Running");
});

const port = 3000;
const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("New Connection");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    socket.broadcast.emit("userJoined", {
      user: "System",
      message: `${users[socket.id]} has joined`,
    });

    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat ${users[socket.id]}`,
    });
  });

  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { user: users[id], message, id });
  });

  socket.on("disconnectChat", () => {
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]} has left `,
    });
  });
});

server.listen(port, () => {
  console.log("Server Running");
});

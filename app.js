const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));


app.set("view engine", "ejs");

io.on("connection", function(socket) {
  // Receive location from client & broadcast to everyone
  socket.on("send-location", function(data) {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  // When client disconnects, notify others to remove their marker
  socket.on("disconnect", function() {
    io.emit("remove-location", socket.id);
  });
});

app.get("/", function(req, res) {
  res.render("index");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});




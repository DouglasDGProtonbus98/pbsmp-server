const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

let jogadores = {};

io.on("connection", socket => {
  console.log(`🟢 ${socket.id} conectado`);

  socket.on("pos_update", data => {
    jogadores[socket.id] = { ...data, id: socket.id };
    io.emit("players", jogadores);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 ${socket.id} desconectou`);
    delete jogadores[socket.id];
    io.emit("players", jogadores);
  });
});

app.get("/", (req, res) => {
  res.send("Servidor PBSMP Online");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
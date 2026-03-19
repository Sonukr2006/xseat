const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

let io;

const initSockets = (server) => {
  io = new Server(server, {
    cors: {
      origin: env.frontendOrigin,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error("Unauthorized"));
    try {
      const decoded = jwt.verify(token, env.jwtSecret);
      socket.userId = decoded.sub;
      return next();
    } catch (err) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    if (!socket.userId) return;
    socket.join(`user:${socket.userId}`);

    socket.on("joinMatch", (matchId) => {
      socket.join(`match:${matchId}`);
    });

    socket.on("leaveMatch", (matchId) => {
      socket.leave(`match:${matchId}`);
    });
  });
};

const emitToUser = (userId, event, payload) => {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
};

const emitToMatch = (matchId, event, payload) => {
  if (!io) return;
  io.to(`match:${matchId}`).emit(event, payload);
};

module.exports = { initSockets, emitToUser, emitToMatch };

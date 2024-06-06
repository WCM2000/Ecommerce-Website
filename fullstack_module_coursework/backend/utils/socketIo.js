// const app = require("../index");

// const { Server } = require("socket.io");

// exports.socketConnection = () => {
//   const io = new Server(app, {
//     cors: {
//       origin: "*",
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log(`User Connected: ${socket.id}`);

//     socket.on("join_room", (data) => {
//       socket.join(data);
//     });

//     socket.on("send_message", (data) => {
//       socket.to(data.room).emit("receive_message", data);
//     });
//   });
// };

// -----------------------------------

// const { Server } = require("socket.io");
// // let socketIo = require("socket.io");
// let io;
// exports.socketConnection = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: "*",
//     },
//   });
//   io.on("connection", (socket) => {
//     console.log("socker server started...");
//     socket.on("client-ready", () => {
//       console.log("client is ready....................");
//       socket.broadcast.emit("get-canvas-state");
//     });

//     socket.on("canvas-state", (state) => {
//       console.log("received canvas state", state);
//       io.emit("canvas-state-from-server", state);
//       // socket.broadcast.emit("canvas-state-from-server", state);
//     });

//     socket.on("draw-line", ({ prevPoint, currentPoint, color }) => {
//       socket.broadcast.emit("draw-line", { prevPoint, currentPoint, color });
//     });

//     socket.on("clear", () => io.emit("clear"));
//   });
// };

// exports.sendMessage = (roomId, key, message) => {
//   // io.to(roomId).emit(key, message);
//   //   console.log(`product:${roomId}`);
//   io.emit(`product:6585c532f568a9e2fbefab9c`, message);
//   //   io.emit("test", "message");
// };
// exports.getRooms = () => io.sockets.adapter.rooms;

// ----------------------------------

// let socketIo = require("socket.io");
// let io;
// exports.socketConnection = (server) => {
//   io = socketIo(server);
//   io.on("connection", (socket) => {
//     console.info(`Client connected [id=${socket.id}]`);
//     // socket.join("room");
//     socket.on("disconnect", () => {
//       console.info(`Client disconnected [id=${socket.id}]`);
//     });
//   });
// };

// exports.sendMessage = (roomId, key, message) => {
//   // io.to(roomId).emit(key, message);
//   //   console.log(`product:${roomId}`);
//   io.emit(`product:6585c532f568a9e2fbefab9c`, message);
//   //   io.emit("test", "message");
// };
// exports.getRooms = () => io.sockets.adapter.rooms;

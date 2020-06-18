const router = require("express").Router();

// Formidable
const formidable = require("formidable");
// Mongoose
const mongoose = require("mongoose");
// Modals
const User = require("./../models/Users");
// Middlaware
const { isAuthenticated } = require("./../middleware/isAuthenticated");

router.get("/messages", isAuthenticated, (req, res) => {
  const { friendId } = req.query;

  let friend = req.user.friends.find(
    (friend) => friend.id.toString() === friendId
  );

  //   console.log(friend);

  return res.status(200).send({
    message: "Got messages successfully",
    type: "success",
    messages: friend.chat,
  });
});

module.exports = router;
// console.log(io);

// Run when client connected
// io.on("connection", socket => {
//   console.log("New IO connection");

//   socket.on("joinRoom", ({
//     username,
//     room
//   }) => {
//     const escapedUsername = escape(username);
//     const escapedRoom = escape(room);
//     const user = userJoin(socket.id, escapedUsername, escapedRoom);

//     socket.join(user.room);
//     socket.emit("message", formatMessage(botName, "Welcome to ChatNow!"));
//     socket.broadcast
//       .to(user.room)
//       .emit(
//         "message",
//         formatMessage(botName, `${escapedUsername} has joined ${escapedRoom} `)
//       );

//     //Send users in room info

//     io.to(user.room).emit("roomUsers", {
//       room: user.room,
//       users: getRoomUsers(user.room)
//     });
//   });
// }

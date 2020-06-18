const router = require("express").Router();

// Mongoose
const mongoose = require("mongoose");
// Modals
const User = require("./../models/Users");
// Middleware
const { isAuthenticated } = require("./../middleware/isAuthenticated");

router.get("/sse", async (req, res) => {
  //   if (!req.user) {
  //     return res.status(404).send({ type: "error", message: "User not found." });
  //   }

  res.set("Content-Type", "text/event-stream");
  res.set("Connection", "keep-alive");
  res.set("Cache-Control", "no-cache");
  //   res.set("Access-Control-Allow-Origin", "*");

  try {
    setInterval(async () => {
      let user = await User.findOne({
        username: "bertearazvan",
      });
      //   console.log("da");
      res.status(200).write(`data: ${JSON.stringify(user)}\n\n`);
    }, 5000);

    // return res.status(200).send({ type: "success", user: user });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ message: "Soemthing went wrong", type: "error" });
  }
});

module.exports = router;

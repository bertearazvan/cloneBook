const router = require("express").Router();

// JWT
const jwt = require("jsonwebtoken");
// Formidable
const formidable = require("formidable");
// Mongoose
const mongoose = require("mongoose");
// Modals
const User = require("./../models/Users");
// Middlaware
const { isAuthenticated } = require("./../middleware/isAuthenticated");
// Utils
const path = require("path");
const fs = require("fs");
const Users = require("./../models/Users");

router.get("/users/remove", isAuthenticated, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { isRemoved: true } },
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({ message: "Something went wrong.", type: "error" });
      }

      return res.status(200).send({
        message: "Profile deleted successfully!",
        type: "success",
      });
    }
  );
});

router.post("/users/addCover", isAuthenticated, async (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: "Something went wrong with formidable!",
        type: "error",
      });
    }

    if (!files.coverImage) {
      return res
        .status(500)
        .send({ message: "No profile image received", type: "error" });
    }

    const fileName = Date.now() + "-" + files.coverImage.name;
    const newPath = path.join(
      "./",
      __dirname,
      "static",
      "images",
      "cover",
      fileName
    );

    fs.copyFile(files.coverImage.path, newPath, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          message: "Something went wrong when saving data!",
          type: "error",
        });
      }

      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $set: { cover: `/images/cover/${fileName}` },
        },
        (err, result) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .send({ message: "Something went wrong.", type: "error" });
          }

          return res.status(200).send({
            message: "Profile image updated successfully!",
            type: "success",
            imageUrl: `/images/cover/${fileName}`,
          });
        }
      );
    });
  });
});

router.post("/users/addProfile", isAuthenticated, async (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: "Something went wrong with formidable!",
        type: "error",
      });
    }

    if (!files.profileImage) {
      return res
        .status(500)
        .send({ message: "No profile image received", type: "error" });
    }

    const fileName = Date.now() + "-" + files.profileImage.name;
    const newPath = path.join(
      "./",
      __dirname,
      "static",
      "images",
      "profile",
      fileName
    );

    fs.copyFile(files.profileImage.path, newPath, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          message: "Something went wrong when saving data!",
          type: "error",
        });
      }

      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $set: {
            photo: `/images/profile/${fileName}`,
            "public_json.photo": `/images/profile/${fileName}`,
          },
        },
        async (err, result) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .send({ message: "Something went wrong.", type: "error" });
          }

          // we go through users
          // we verify if the user has our id
          // if it does we update the ...public_json

          // we go through the user's posts
          // we go through the user's comments
          // we go through the user's replies

          // we go through the user's friends
          // we go through the user's notifications

          await User.find()
            .then((users) => {
              for (let i = 0; i < users.length; i++) {
                // if (users[i]._id.toString() === req.user._id.toString()) {
                //   users[i].public_json = {
                //     ...users[i].public_json,
                //     photo: `/images/profile/${fileName}`,
                //   };
                // }

                for (let j = 0; j < users[i].posts.length; j++) {
                  if (
                    users[i].posts[j].user.id.toString() ===
                    req.user._id.toString()
                  ) {
                    users[i].posts[
                      j
                    ].user.photo = `/images/profile/${fileName}`;
                  }

                  for (let k = 0; k < users[i].posts[j].comments.length; k++) {
                    if (
                      users[i].posts[j].comments[k].user.id.toString() ===
                      req.user._id.toString()
                    ) {
                      users[i].posts[j].comments[
                        k
                      ].user.photo = `/images/profile/${fileName}`;
                    }

                    for (
                      let y = 0;
                      y < users[i].posts[j].comments[k].replies.length;
                      y++
                    ) {
                      if (
                        users[i].posts[j].comments[k].replies[
                          y
                        ].user.id.toString() === req.user._id.toString()
                      ) {
                        users[i].posts[j].comments[k].replies[
                          y
                        ].user.photo = `/images/profile/${fileName}`;
                      }
                    }
                  }
                }

                // we go through friends & notif

                for (let d = 0; d < users[i].friends.length; d++) {
                  if (
                    users[i].friends[d].id.toString() ===
                    req.user._id.toString()
                  ) {
                    users[i].friends[d].photo = `/images/profile/${fileName}`;
                  }
                }

                for (let u = 0; u < users[i].notifications.length; u++) {
                  if (
                    users[i].notifications[u].user.id.toString() ===
                    req.user._id.toString()
                  ) {
                    users[i].notifications[
                      u
                    ].user.photo = `/images/profile/${fileName}`;
                  }
                }

                users[i].save();
              }
            })
            .then(() => {
              return res.status(200).send({
                message: "Profile image updated successfully!",
                type: "success",
                imageUrl: `/images/profile/${fileName}`,
              });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .send({ message: "Something went wrong.", type: "error" });
            });
        }
      );
    });
  });
});

router.get("/users/signOut", isAuthenticated, async (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: { status: 0, token: "" } },
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({ message: "Something went wrong.", type: "error" });
      }

      return res
        .status(200)
        .send({ message: "Logged out successfully", type: "success" });
    }
  );
});

router.get("/users/checkStatus", isAuthenticated, async (req, res) => {
  const { friendId } = req.query;

  User.findOne({ _id: friendId }, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: "Something went wrong.", type: "error" });
    }

    return res.status(200).send({
      message: "Status received successfully!",
      type: "success",
      status: result.status,
    });
  });
});

router.get("/users/session", isAuthenticated, (req, res) => {
  if (!req.user) {
    return res.status(404).send({ type: "error" });
  }

  return res.status(200).send({ type: "success" });
});

router.get("/users/search", isAuthenticated, (req, res) => {
  const { searchItem } = req.query;
  console.log(searchItem);

  User.find(
    {
      $or: [
        { username: { $regex: ".*" + searchItem + ".*" } },
        { firstName: { $regex: ".*" + searchItem + ".*" } },
        { lastName: { $regex: ".*" + searchItem + ".*" } },
      ],
    },
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({ message: "Something went wrong.", type: "error" });
      }

      return res.status(200).send({ result: result, type: "success" });
    }
  );
});

router.get("/profile", isAuthenticated, (req, res) => {
  return res.status(200).send({ user: req.user });
});

router.post("/users/login", (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: "Something went wrong with formidable!",
        type: "error",
      });
    }

    if (!fields.username || !fields.password) {
      return res.status(500).send({
        message: "Missing fields!",
        type: "error",
      });
    }

    const token = jwt.sign(
      {
        username: fields.username,
      },
      "cloneBook"
    );

    User.findOneAndUpdate(
      { username: fields.username, isRemoved: false },
      { token: token, status: 1 },
      (err, result) => {
        if (err) {
          return res.status(500).send({
            message: "Something went wrong!",
            type: "error",
          });
        }

        if (result === null) {
          return res.status(404).send({
            message: "User can't be found.",
            type: "error",
          });
        }
        // console.log(token);
        console.log(result);
        return res.status(200).send({
          message: "Logged in successfully!",
          type: "success",
          token: token,
          user: result,
        });
      }
    );
  });
});

router.post("/users/signup", (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: "Something went wrong with formidable!",
        type: "error",
      });
    }

    if (
      !fields.firstName ||
      !fields.lastName ||
      !fields.username ||
      !fields.password ||
      !fields.repeatPassword
    ) {
      return res.status(500).send({
        message: "Missing fields!",
        type: "error",
      });
    }

    if (fields.password !== fields.repeatPassword) {
      return res.status(500).send({
        message: "Passwords do not match!",
        type: "error",
      });
    }

    User.findOne({ username: fields.username }, (err, result) => {
      if (err) {
        return res.status(500).send({
          message: "Something went wrong!",
          type: "error",
        });
      }

      if (result !== null) {
        return res.status(500).send({
          message: "Username already exists!",
          type: "error",
        });
      }

      let userId = new mongoose.Types.ObjectId();
      const user = new User({
        _id: userId,
        firstName: fields.firstName,
        lastName: fields.lastName,
        username: fields.username,
        password: fields.password,
        public_json: {
          id: userId,
          firstName: fields.firstName,
          lastName: fields.lastName,
          username: fields.username,
          photo: "/images/profile/default.jpg",
          status: 0,
        },
      });
      user.save((err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send({
            message: "Something went wrong when saving data!",
            type: "error",
          });
        }
        // console.log(result);
        return res
          .status(200)
          .send({ message: "Registered successfully!", type: "success" });
      });
    });
  });
});

module.exports = router;

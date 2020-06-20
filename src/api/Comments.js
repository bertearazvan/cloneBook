const router = require("express").Router();

// Formidable
const formidable = require("formidable");
// Mongoose
const mongoose = require("mongoose");
// Modals
const User = require("./../models/Users");
// Middlaware
const { isAuthenticated } = require("./../middleware/isAuthenticated");

router.get("/comments/likes", isAuthenticated, async (req, res) => {
  const { postId, userId, commentId } = req.query;

  if (!commentId || !postId || !userId) {
    return res.status(500).send({ message: "Missing fields", type: "error" });
  }

  let user = await User.findById(userId);

  let likes;
  for (let i = 0; i < user.posts.length; i++) {
    if (user.posts[i]._id.toString() === postId) {
      for (let j = 0; j < user.posts[i].comments.length; j++) {
        if (user.posts[i].comments[j]._id.toString() === commentId) {
          likes = user.posts[i].comments[j].likes;
        }
      }
    }
  }

  return res.status(200).send({
    message: "Likes received successfully!",
    type: "success",
    likes,
  });
});

// I already built it with a GET so I just don't want to change for efficiency
router.get("/comments/addLike", isAuthenticated, async (req, res) => {
  const { postId, userId, commentId } = req.query;

  if (!commentId || !postId || !userId) {
    return res.status(500).send({ message: "Missing fields", type: "error" });
  }

  let user = await User.findById(userId);

  for (let i = 0; i < user.posts.length; i++) {
    if (user.posts[i]._id.toString() === postId) {
      for (let j = 0; j < user.posts[i].comments.length; j++) {
        if (user.posts[i].comments[j]._id.toString() === commentId) {
          if (user.posts[i].comments[j].likes.length > 0) {
            let myLike = user.posts[i].comments[j].likes.find(
              (item) => item.id.toString() === req.user._id.toString()
            );
            if (myLike) {
              user.posts[i].comments[j].likes = user.posts[i].comments[
                j
              ].likes.filter(
                (user) => user.id.toString() !== req.user._id.toString()
              );
              break;
            } else {
              user.posts[i].comments[j].likes = [
                ...user.posts[i].comments[j].likes,
                req.user.public_json,
              ];

              user.notifications = [
                {
                  _id: new mongoose.Types.ObjectId(),
                  type: "like",
                  body: "Has liked your comment",
                  user: { ...req.user.public_json },
                },
                ...user.notifications,
              ];
              break;
            }
          } else {
            user.posts[i].comments[j].likes.push(req.user.public_json);
            user.notifications.push({
              _id: new mongoose.Types.ObjectId(),
              type: "like",
              body: "Has liked your comment",
              user: { ...req.user.public_json },
            });
            break;
          }
        }
      }
    }
  }

  user.save((err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: "Something went wrong when saving data!",
        type: "error",
      });
    }

    return res
      .status(200)
      .send({ message: "Like added successfully!", type: "success" });
  });
});

router.get("/comments/update", isAuthenticated, async (req, res) => {
  const { commentId, commentBody, postId, userId } = req.query;

  if (!commentId || !commentBody || !postId || !userId) {
    return res.status(500).send({ message: "Missing fields", type: "error" });
  }

  let user = await User.findById(userId);

  for (let i = 0; i < user.posts.length; i++) {
    if (user.posts[i]._id.toString() === postId) {
      for (let j = 0; j < user.posts[i].comments.length; j++) {
        // console.log(user.posts[i].comments.length);
        if (user.posts[i].comments[j]._id.toString() === commentId) {
          user.posts[i].comments[j].comment_body = commentBody;
        }
      }
    }
  }

  user.save((err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: "Something went wrong when saving data!",
        type: "error",
      });
    }

    return res
      .status(200)
      .send({ message: "Comment updated successfully!", type: "success" });
  });
});

router.get("/comments/delete", isAuthenticated, async (req, res) => {
  const { commentId, postId, userId } = req.query;
  console.log(commentId, postId, userId);

  if (!commentId || !postId || !userId) {
    return res.status(500).send({ message: "Missing fields", type: "error" });
  }

  let user = await User.findById(userId);

  for (let i = 0; i < user.posts.length; i++) {
    user.posts[i].comments = user.posts[i].comments.filter(
      (comment) => comment._id.toString() !== commentId
    );
  }

  user.save((err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: "Something went wrong when saving data!",
        type: "error",
      });
    }

    return res
      .status(200)
      .send({ message: "Comment deleted successfully!", type: "success" });
  });
});

router.post("/comments", isAuthenticated, async (req, res) => {
  const form = formidable({ multiples: true });
  //   const { postId, commentBody } = req.query;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: "Something went wrong with formidable!",
        type: "error",
      });
    }

    // we want to add the comment to the post

    let user = await User.findById(fields.userId);

    for (let i = 0; i < user.posts.length; i++) {
      if (user.posts[i]._id.toString() === fields.postId) {
        user.posts[i].comments = [
          ...user.posts[i].comments,
          {
            _id: new mongoose.Types.ObjectId(),
            comment_body: fields.commentBody,
            post_id: mongoose.Types.ObjectId(fields.postId),
            user: {
              ...req.user.public_json,
              id: mongoose.Types.ObjectId(req.user._id),
            },
          },
        ];
        user.posts[i].comments = user.posts[i].comments;
      }
    }

    user.save((err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          message: "Something went wrong when saving data!",
          type: "error",
        });
      }

      let post = result.posts.find(
        (post) => post._id.toString() === fields.postId
      );

      return res.status(200).send({
        message: "Added the post successfully!",
        type: "success",
        comment: post.comments[post.comments.length - 1],
      });
    });
  });
});

module.exports = router;

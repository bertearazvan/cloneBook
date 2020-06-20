const router = require("express").Router();

// Formidable
const formidable = require("formidable");
// Mongoose
const mongoose = require("mongoose");
// Modals
const User = require("./../models/Users");
// Middlaware
const { isAuthenticated } = require("./../middleware/isAuthenticated");

router.get("/replies/likes", isAuthenticated, async (req, res) => {
  const { userId, postId, commentId, replyId } = req.query;

  if (!userId || !postId || !commentId || !replyId) {
    return res.status(500).send({ message: "Missing fields", type: "error" });
  }

  let user = await User.findById(userId);
  let likes;

  for (let i = 0; i < user.posts.length; i++) {
    if (user.posts[i]._id.toString() === postId) {
      for (let j = 0; j < user.posts[i].comments.length; j++) {
        if (user.posts[i].comments[j]._id.toString() === commentId) {
          for (let k = 0; k < user.posts[i].comments[j].replies.length; k++) {
            if (
              user.posts[i].comments[j].replies[k]._id.toString() === replyId
            ) {
              likes = user.posts[i].comments[j].replies[k].likes;
            }
          }
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

router.post("/replies/likes", isAuthenticated, (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: "Something went wrong with formidable!",
        type: "error",
      });
    }
    // we have to pass userId, postId, commentId, commentBody
    console.log(fields);

    if (
      !fields.userId ||
      !fields.postId ||
      !fields.commentId ||
      !fields.replyId
    ) {
      return res.status(500).send({ message: "Missing fields", type: "error" });
    }

    console.log(fields);

    let user = await User.findById(fields.userId);

    for (let i = 0; i < user.posts.length; i++) {
      if (user.posts[i]._id.toString() === fields.postId) {
        for (let j = 0; j < user.posts[i].comments.length; j++) {
          if (user.posts[i].comments[j]._id.toString() === fields.commentId) {
            for (let k = 0; k < user.posts[i].comments[j].replies.length; k++) {
              if (user.posts[i].comments[j].replies[k].likes.length > 0) {
                let myLike = user.posts[i].comments[j].replies[k].likes.find(
                  (item) => item.id.toString() === req.user._id.toString()
                );
                console.log(myLike);

                if (myLike) {
                  user.posts[i].comments[j].replies[k].likes = user.posts[
                    i
                  ].comments[j].replies[k].likes.filter(
                    (user) => user.id.toString() !== req.user._id.toString()
                  );
                  break;
                } else {
                  user.posts[i].comments[j].replies[k].likes = [
                    ...user.posts[i].comments[j].replies[k].likes,
                    req.user.public_json,
                  ];
                  user.notifications = [
                    {
                      _id: new mongoose.Types.ObjectId(),
                      type: "like",
                      body: "Has liked your reply",
                      user: { ...req.user.public_json },
                    },
                    ...user.notifications,
                  ];
                  break;
                }
              } else {
                user.posts[i].comments[j].replies[k].likes.push(
                  req.user.public_json
                );
                user.notifications.push({
                  _id: new mongoose.Types.ObjectId(),
                  type: "like",
                  body: "Has liked your reply",
                  user: { ...req.user.public_json },
                });
                break;
              }
            }
          }
        }
      }
    }

    user.save((err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          message: "Something went wrong!",
          type: "error",
        });
      }

      return res.status(200).send({
        message: "Updated the like successfully!",
        type: "success",
      });
    });
  });
});

router.get("/replies/update", isAuthenticated, async (req, res) => {
  let { userId, postId, commentId, replyId, replyBody } = req.query;

  if (!userId || !postId || !commentId || !replyId || !replyBody) {
    return res.status(500).send({ message: "Missing fields", type: "error" });
  }

  let user = await User.findById(userId);

  for (let i = 0; i < user.posts.length; i++) {
    if (user.posts[i]._id.toString() === postId) {
      for (let j = 0; j < user.posts[i].comments.length; j++) {
        if (user.posts[i].comments[j]._id.toString() === commentId) {
          for (let k = 0; k < user.posts[i].comments[j].replies.length; k++) {
            if (
              user.posts[i].comments[j].replies[k]._id.toString() === replyId
            ) {
              user.posts[i].comments[j].replies[k].comment_body = replyBody;
            }
          }
        }
      }
    }
  }

  user.save((err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: "Something went wrong!",
        type: "error",
      });
    }

    return res.status(200).send({
      message: "Updated the reply successfully!",
      type: "success",
    });
  });
});

router.get("/replies/delete", isAuthenticated, async (req, res) => {
  let { userId, postId, commentId, replyId } = req.query;

  if (!userId || !postId || !commentId || !replyId) {
    return res.status(500).send({ message: "Missing fields", type: "error" });
  }

  let user = await User.findById(userId);

  for (let i = 0; i < user.posts.length; i++) {
    if (user.posts[i]._id.toString() === postId) {
      for (let j = 0; j < user.posts[i].comments.length; j++) {
        if (user.posts[i].comments[j]._id.toString() === commentId) {
          user.posts[i].comments[j].replies = user.posts[i].comments[
            j
          ].replies.filter((reply) => reply._id.toString() !== replyId);
        }
      }
    }
  }

  user.save((err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: "Something went wrong!",
        type: "error",
      });
    }

    return res.status(200).send({
      message: "Removed the reply successfully!",
      type: "success",
    });
  });
});

router.post("/replies", isAuthenticated, async (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: "Something went wrong with formidable!",
        type: "error",
      });
    }
    // we have to pass userId, postId, commentId, commentBody
    // console.log(fields);

    if (
      !fields.userId ||
      !fields.postId ||
      !fields.commentId ||
      !fields.commentBody
    ) {
      return res.status(500).send({ message: "Missing fields", type: "error" });
    }

    let user = await User.findById(fields.userId);

    for (let i = 0; i < user.posts.length; i++) {
      if (user.posts[i]._id.toString() === fields.postId) {
        for (let j = 0; j < user.posts[i].comments.length; j++) {
          if (user.posts[i].comments[j]._id.toString() === fields.commentId) {
            user.posts[i].comments[j].replies = [
              ...user.posts[i].comments[j].replies,
              {
                _id: new mongoose.Types.ObjectId(),
                comment_body: fields.commentBody,
                post_id: mongoose.Types.ObjectId(fields.postId),
                comment_id: mongoose.Types.ObjectId(fields.commentId),
                user: { ...req.user.public_json },
              },
            ];
          }
        }
      }
    }

    user.save((err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          message: "Something went wrong!",
          type: "error",
        });
      }

      let currentPost = result.posts.find(
        (post) => post._id.toString() === fields.postId
      );
      let currentComm = currentPost.comments.find(
        (comment) => comment._id.toString() === fields.commentId
      );

      return res.status(200).send({
        message: "Added the post successfully!",
        type: "success",
        reply: currentComm.replies[currentComm.replies.length - 1],
      });
    });
  });
});

module.exports = router;

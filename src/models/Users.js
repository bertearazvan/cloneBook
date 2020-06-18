const mongoose = require("mongoose");

const publicJsonSchemaUniqueId = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: mongoose.Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  username: String,
  photo: String,
  status: Number,
});

const publicJsonSchema = mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    username: String,
    photo: String,
    status: Number,
  },
  { _id: false }
);

const replySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  comment_body: "String",
  timestamp: { type: Date, default: Date.now },
  likes: [publicJsonSchema],
  post_id: mongoose.Schema.Types.ObjectId,
  user: [publicJsonSchema],
});

const commentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  comment_body: "String",
  timestamp: { type: Date, default: Date.now },
  likes: [publicJsonSchema],
  post_id: mongoose.Schema.Types.ObjectId,
  user: [publicJsonSchema],
  replies: [replySchema],
});

const postSchema = mongoose.Schema({
  description: String,
  timestamp: { type: Date, default: Date.now },
  photo: { type: String, default: "" },
  likes: [publicJsonSchema],
  user: publicJsonSchema,
  comments: [commentSchema],
});

const chatSchema = mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  message: String,
  timestamp: { type: Date, default: Date.now },
  isMe: Boolean,
});

const friendSchema = mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    username: String,
    photo: String,
    status: Number,
    friendshipStatus: String,
    chat: [chatSchema],
  },
  { _id: false }
);

const notificationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: String,
  body: String,
  user: publicJsonSchema,
  timestamp: { type: Date, default: Date.now },
});

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  token: { type: String, default: "" },
  photo: { type: String, default: "/images/profile/default.jpg" },
  cover: { type: String, default: "/images/cover/default_cover.jpg" },
  status: { type: Number, default: 0 },
  public_json: publicJsonSchema,
  posts: [postSchema],
  activeChats: [],
  friends: [friendSchema],
  notifications: [notificationSchema],
});

module.exports = mongoose.model("User", userSchema);

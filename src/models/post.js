const mongoose = require("mongoose");
const constants = require("../utility/constants");
const objectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    authorId: {
      type: objectId,
      ref: "baseUser",
      required: true,
    },
    est_price: {
      type: Number,
      required: true,
    },
    isDone: {
      type: Boolean,
      required: true,
      default: false,
    },
    isRemote: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const postModel = mongoose.model("post", postSchema);
module.exports = postModel;

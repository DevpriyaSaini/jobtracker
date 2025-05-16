const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  jobDisc: {
    type: String,
    required: true,
  },
  orderValue: {
    type: Number,
    required: true,
  },
  orderNumber: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  fileUrl: { type: String, required: true },

  fileType: { type: String, required: true },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const job = mongoose.model("jobSection", schema);

module.exports = job;

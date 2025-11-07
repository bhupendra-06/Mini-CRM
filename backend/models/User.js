const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: String,
  password: String,
  role: {
    type: String,
    enum: ["staff", "lead"],
    default: "lead",
  },
});

module.exports = mongoose.model("User", userSchema);

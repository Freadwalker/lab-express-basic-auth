const mongoose = require("mongoose");

var Schema= mongoose.Schema;
var userSchema = new Schema(
  {
    username: String,
    password: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("users", userSchema);
module.exports = User;

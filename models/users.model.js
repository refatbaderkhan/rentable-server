const mongoose = require("mongoose");


const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  first_name: String,
  last_name: String,
  email: {
      type: String,
      unique: true,
  },
  profile_picture: String,
  password: String,
}, {
  timestamps: true
})

const User = mongoose.model('User', usersSchema);
module.exports = User
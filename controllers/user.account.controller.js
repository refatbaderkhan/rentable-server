const User = require("../models/user.model")
const Item = require("../models/item.model")
const bcrypt = require("bcrypt")


const updateAccount = async (req, res)=>{
  const {user_id} = req.params;
  const {username, first_name, last_name, email} = req.body;
  const profile_picture = req.file ? req.file.filename : "";
  const {_id: auth_user_id} = req.user;

  try {
    if (user_id !== auth_user_id) {
      return res.status(401).send("You are not authorized to update this account.");
    }

    const user = await User.findById(user_id);

    if (username) user.username = username;
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (email) user.email = email;
    if (profile_picture) user.profile_picture = profile_picture;

    await user.save();

    res.status(200).send({user, message: "Account updated successfully."});
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the account.");
  }
}


module.exports = {
  updateAccount
}
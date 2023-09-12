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


const updatePassword = async (req, res)=>{
  const {user_id} = req.params;
  const {_id: auth_user_id} = req.user;
  const {current_password, new_password} = req.body;

  try {
    if (user_id !== auth_user_id) {
      return res.status(401).send("You are not authorized to update this account.");
    }

    const user = await User.findById(user_id);

    if(!user.comparePassword(current_password)){
      return res.status(400).send("Current password is incorrect.");
    }

    user.password = await bcrypt.hash(new_password, 10);

    await user.save();

    res.status(200).send({user, message: "Password updated successfully."});
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while updating the password.");
  }
}


const deleteAccount = async (req, res)=>{
  const {user_id} = req.params;
  const {_id: auth_user_id} = req.user;

  try {
    if (user_id !== auth_user_id) {
      return res.status(401).send("You are not authorized to delete this account.");
    }

    const user = await User.findById(user_id);
    const items = await Item.find({user_id});

    const usersFavorites = await User.find({"user_favorites.item_id": {$in: items.map(item=>item._id)}});
    for(const user of usersFavorites){
      user.user_favorites.pull({item_id: {$in: items.map(item=>item._id)}});
      await user.save();
    }

    const usersBookings = await User.find({"user_bookings.item_id": {$in: items.map(item=>item._id)}});
    for (const user of usersBookings) {
      user.user_bookings.pull({item_id: {$in: items.map(item=>item._id)}});
      await user.save();
    }

    const usersRatings = await User.find({"user_ratings.item_id": {$in: items.map(item=>item._id)}});
    for (const user of usersRatings) {
      user.user_ratings.pull({item_id: {$in: items.map(item=>item._id)}});
      await user.save();
    }

    await Item.deleteMany({user_id});
    
    await user.remove();

    res.status(200).send({message: "Account deleted successfully."});
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while deleting the account.");
  }
}


module.exports = {
  updateAccount,
  updatePassword
}
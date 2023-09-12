const {Category, SubCategory, Area, City} = require("../models/item.model")
const User = require("../models/user.model")
const Item = require("../models/item.model")
const bcrypt = require("bcrypt");


const updateUserPassword = async (req, res)=>{
  const {user_id} = req.params;
  const {new_password , admin_password} = req.body;
  const {_id: admin_user_id} = req.user;

  try {
    const admin = await User.findById(admin_user_id);

    const isCorrect = await bcrypt.compare(admin_password, admin.password);
    if (!isCorrect) {
      return res.status(401).send("Incorrect admin password.");
    }

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (user.user_type === 0) {
      return res.status(401).send("Admin password cannot be updated.");
    }

    hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).send({ message: "User password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the user password.");
  }
}

const deleteUserAccount = async (req, res)=>{
  const {user_id} = req.params;
  const {admin_password} = req.body;
  const {_id: admin_user_id} = req.user;
  
  try {
    const admin = await User.findById(admin_user_id);

    const isCorrect = await bcrypt.compare(admin_password, admin.password);
    if (!isCorrect) {
      return res.status(401).send("Incorrect admin password.");
    }

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (user.user_type === 0) {
      return res.status(401).send("Admin account cannot be deleted.");
    }

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
    
    await User.deleteOne({_id: user_id});

    res.status(200).send({message: "Account deleted successfully."});
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the user account.");
  }
}


module.exports = {
  updateUserPassword,
  deleteUserAccount,
}


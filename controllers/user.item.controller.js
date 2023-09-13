const User = require("../models/user.model")
const {Item, Category, SubCategory, City} = require("../models/item.model")


const getUserItems = async (req, res)=>{
  const {user_id} = req.params;

  try {
    const user = await User.findById(user_id).populate("user_items");

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.status(200).send(user.user_items);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while getting the user's items.");
  }
}


module.exports = {
  getUserItems
}
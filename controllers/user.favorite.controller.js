const User = require("../models/user.model")
const Item = require("../models/item.model")


const getFavorites = async (req, res) => {
  const { _id: user_id } = req.user;

  try {
    const user = await User.findById(user_id).populate("user_favorites.item_id");

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.status(200).send(user.user_favorites);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while getting the favorites.");
  }
};


module.exports = {
  getFavorites
}
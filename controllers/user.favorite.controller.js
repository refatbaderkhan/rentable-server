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


const addFavorite = async (req, res) => {
  const { item_id } = req.params;
  const { _id: user_id } = req.user;

  try {
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    const existingFavorite = user.user_favorites.find(favorite => favorite.item_id.toString() === item_id);

    if (existingFavorite) {
      return res.status(400).send("Item already in favorites.");
    }

    user.user_favorites.push({ item_id });

    await user.save();

    res.status(200).send({ message: "Item added to favorites successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while adding the item to favorites.");
  }
};


module.exports = {
  getFavorites,
  addFavorite
}
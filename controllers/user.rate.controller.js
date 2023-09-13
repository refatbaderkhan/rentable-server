const User = require("../models/user.model")
const Item = require("../models/item.model")


const rateItem = async (req, res) => {
  const { item_id } = req.params;
  const { rating, review } = req.body;
  const { _id: user_id, username, profile_picture } = req.user;

  try {
    const item = await Item.findById(item_id);

    if (!item) {
      return res.status(404).send("Item not found.");
    }

    if (item.user_id.toString() === user_id) {
      return res.status(400).send("You cannot rate or review your own item.");
    }

    if ((rating && (rating < 1 || rating > 5)) || (review && review.trim() === "")) {
      return res.status(400).send("Invalid rating or review.");
    }

    const ratingObject = {
      user_id,
      username,
      profile_picture,
      rating,
      review,
    };

    if (rating || review) {
      item.item_ratings.push(ratingObject);
    }

     await item.save();

    res.status(200).send({ item, message: "Item rated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while rating the item.");
  }
};


module.exports = {
  rateItem
}
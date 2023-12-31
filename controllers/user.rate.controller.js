const User = require("../models/user.model")
const {Item} = require("../models/item.model")


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

    res.status(200).send({ratingObject});
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while rating the item.");
  }
};


const modifyItemRating = async (req, res) => {
  const { item_id, rating_id } = req.params;
  const { rating, review } = req.body;
  const { _id: user_id } = req.user;

  try {
    const item = await Item.findById(item_id);

    if (!item) {
      return res.status(404).send("Item not found.");
    }
    
    const ratingObject = item.item_ratings.find(
      (rating) => rating._id.toString() === rating_id
    );

    if (!ratingObject) {
      return res.status(404).send("Rating not found.");
    }

    if (ratingObject.user_id.toString() !== user_id) {
      return res.status(401).send("You are not authorized to modify this rating.");
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).send("Rating must be between 1 and 5.");
      }
      ratingObject.rating = rating;
    }

    if (review !== undefined) {
      ratingObject.review = review;
    }

    await item.save();

    res.status(200).send({ item, message: "Rating modified successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while modifying the rating.");
  }
};


const deleteItemRating = async (req, res) => {
  const { item_id, type, rating_id } = req.params;
  const { _id: user_id } = req.user;

  try {
    const item = await Item.findById(item_id);

    if (!item) {
      return res.status(404).send("Item not found.");
    }

    if (type !== "rating" && type !== "review") {
      return res.status(400).send("Invalid type.");
    }

    const ratingObject = item.item_ratings.find((rating) => rating._id.toString() === rating_id);

    if (!ratingObject) {
      return res.status(404).send("Rating not found.");
    }

    if (ratingObject.user_id.toString() !== user_id) {
      return res.status(401).send("You are not authorized to delete this rating.");
    }

    if (type === "rating" && ratingObject.rating === null) {
      return res.status(400).send("No rating exisits to delete.");
    } else if (type === "review" && ratingObject.review === null) {
      return res.status(400).send("No review exisits to delete.");
    }

    ratingObject[type] = null;

    if (ratingObject.rating === null && ratingObject.review === null) {
      const ratingIndex = item.item_ratings.findIndex((rating) => rating._id.toString() === rating_id);

    if (ratingIndex === -1) {
      item.item_ratings.pull(ratingIndex);
    }
  }

    await item.save();
    res.status(200).send({ item, message: `${type} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the rating.");
  }
};


const rateUser = async (req, res) => {
  const { user_id } = req.params;
  const { rating, review } = req.body;
  const { _id: rater_user_id, username: rater_username, profile_picture: rater_profile_picture } = req.user;
  
  try {
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (user._id.toString() === rater_user_id) {
      return res.status(400).send("You cannot rate yourself.");
    }

    if ((rating && (rating < 1 || rating > 5)) || (review && review.trim() === "")) {
      return res.status(400).send("Invalid rating or review.");
    }

    const ratingObject = {
      rater_user_id,
      rater_username,
      rater_profile_picture,
      rating,
      review,
    };

    if (rating || review) {
      user.user_ratings.push(ratingObject);
    }

    await user.save();

    res.status(200).send({ ratingObject });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while rating the user.");
  }
};


const modifyUserRating = async (req, res) => {
  const { user_id, rating_id } = req.params;
  const { rating, review } = req.body;
  const { _id: rater_user_id } = req.user;

  try {
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    const ratingObject = user.user_ratings.find((rating) => rating._id.toString() === rating_id);
    
    if (!ratingObject) {
      return res.status(404).send("Rating not found.");
    }

    if (ratingObject.rater_user_id.toString() !== rater_user_id) {
      return res.status(401).send("You are not authorized to modify this rating.");
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).send("Rating must be between 1 and 5.");
      }
      ratingObject.rating = rating;
    }

    if (review !== undefined) {
      ratingObject.review = review;
    }

    await user.save();
    
    res.status(200).send({ user, message: "Rating modified successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while modifying the rating.");
  }
};


const deleteUserRating = async (req, res) => {
  const { user_id, type, rating_id } = req.params;
  const { _id: rater_user_id } = req.user;

  try {
    const user = await User.findById(user_id);
    
    if(!user) {
      return res.status(404).send("User not found.");
    }

    if (type !== "rating" && type !== "review") {
      return res.status(400).send("Invalid type.");
    }

    const ratingObject = user.user_ratings.find((rating) => rating._id.toString() === rating_id);
    
    if (!ratingObject) {
      return res.status(404).send("Rating not found.");
    }

    if (ratingObject.rater_user_id.toString() !== rater_user_id) {
      return res.status(401).send("You are not authorized to delete this rating.");
    }

    if (type === "rating" && ratingObject.rating === null) {
      return res.status(400).send("No rating exisits to delete.");
    } else if (type === "review" && ratingObject.review === null) {
      return res.status(400).send("No review exisits to delete.");
    }

    ratingObject[type] = null;

    if (ratingObject.rating === null && ratingObject.review === null) {
      const ratingIndex = user.user_ratings.findIndex((rating) => rating._id.toString() === rating_id);

      if (ratingIndex === -1) {
        user.user_ratings.pull(ratingIndex);
      }
    }

      await user.save();  
      return res.status(200).send({ message: "Rating/review and document deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the rating.");
  }
};


module.exports = {
  rateItem,
  modifyItemRating,
  deleteItemRating,
  rateUser,
  modifyUserRating,
  deleteUserRating,
}
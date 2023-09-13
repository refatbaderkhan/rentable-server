const User = require("../models/user.model")
const {Item} = require("../models/item.model")


const getBookings = async (req, res)=>{
  const {user_id} = req.params;

  try {
    const user = await User.findById(user_id).populate("user_bookings.item_id");

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.status(200).send(user.user_bookings);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while getting the bookings.");
  }
}

module.exports = {
  getBookings
}
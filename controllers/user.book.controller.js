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


const bookItem = async (req, res)=>{
  const {item_id} = req.params;
  const {start_date, end_date} = req.body;
  const {_id: user_id, username} = req.user;

  try {
    const item = await Item.findById(item_id);

    if (!item) {
      return res.status(404).send("Item not found.");
    }

    const overlappingBooking = item.item_bookings.find(booking => {
      const bookingStartDate = new Date(booking.start_date);
      const bookingEndDate = new Date(booking.end_date);
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      return (startDate >= bookingStartDate && startDate <= bookingEndDate) || (endDate >= bookingStartDate && endDate <= bookingEndDate);
    });

    if (overlappingBooking) {
      return res.status(400).send("The item is already booked for the selected dates.");
    }

    const booking = {
      user_id,
      username,
      start_date,
      end_date,
    };

    item.item_bookings.push(booking);
    await item.save();

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    user.user_bookings.push({
      item_id,
      item_name: item.item_name,
      start_date,
      end_date, 
      item_booking_id: item.item_bookings[item.item_bookings.length - 1]._id,
    });
    await user.save();

    res.status(200).send({item, message: "Item booked successfully."});
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while booking the item.");
  }
}


module.exports = {
  getBookings,
  bookItem
}
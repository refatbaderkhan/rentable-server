const mongoose = require("mongoose");
const Item = require("./item.model");


const favoriteSchema = new mongoose.Schema({
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  },
});


const bookingSchema = new mongoose.Schema({
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  },
  item_name: String,
  start_date: Date,
  end_date: Date,
  item_booking_id: String,
});


const ratingSchema = new mongoose.Schema({
  rater_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rater_username: String,
  rater_profile_picture: String,
  rated_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  review: String,
}, {
  timestamps: true,
});


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  first_name: String,
  last_name: String,
  city: String,
  area: String,
  email: {
      type: String,
      unique: true,
  },
  profile_picture: String,
  password: String,
  user_type: {
    type: Number,
    enum: [0, 1],
    default: 1,
  },
  user_favorites: [favoriteSchema],
  user_bookings: [bookingSchema],
  user_ratings: [ratingSchema],
  user_items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
}, {
  timestamps: true
})


const User = mongoose.model('User', userSchema);
module.exports = User
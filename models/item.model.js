const mongoose = require("mongoose");
const User = require("./user.model");


const subCategorySchema = new mongoose.Schema({
  subCategory_name: String,
  subCategory_water: Number,
  subCategory_co2: Number,
  subCategory_waste: Number,
  subCategory_dimensions: String,
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);


const categorySchema = new mongoose.Schema({
  category_name: String,
  subCategories_names: [String],
  subCategorySchema: [subCategorySchema],
});

const Category = mongoose.model("Category", categorySchema);


const citySchema = new mongoose.Schema({
  city_name: String,
  areas: [String],
});

const City = mongoose.model("City", citySchema);


const locationSchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
  },
  city_name: String,
  area: String,
  latitude: Number,
  longitude: Number,
});


const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  username: String,
  start_date: Date,
  end_date: Date,
});


const ratingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  username: String,
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


const itemSchema = new mongoose.Schema({
  item_name: String,
  item_description: String,
  item_price: Number,
  item_images: [String],
  item_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  item_category_name: String,
  item_subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
  },
  item_subcategory_name: String,
  item_location: locationSchema,
  item_bookings: [bookingSchema],
  item_ratings: [ratingSchema],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  username: String,
  user_profile_picture: String,
}, {
  timestamps: true
})

const Item = mongoose.model('Item', itemSchema);

module.exports = {
  Category,
  SubCategory,
  City,
  Item
}

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


module.exports = {
  Category,
  SubCategory,

}

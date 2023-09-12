const {Item, Category, SubCategory} = require("../models/item.model")
const User = require("../models/user.model")


const createCategory = async (req, res)=>{
  const {category_name} = req.body;

  try {
    const category = new Category({category_name});

    if(!category) {
      return res.status(400).send("Category name is required.");
    }

    const existingCategory = await Category.findOne({ category_name });
    if (existingCategory) {
      return res.status(400).send("Category already exists.");
    } 

    await category.save();

    res.status(201).send({ category, message: "Category created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the category.");
  }
};


module.exports = {
  createCategory,
}


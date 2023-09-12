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


const createSubCategory = async (req, res)=>{
  const {category_id} = req.params;
  const {subCategory_name} = req.body;

  try {
    if (!category_id || !subCategory_name) {
      return res.status(400).send("Category ID and subcategory name are required.");
    }

    const category = await Category.findById(category_id);

    if (!category) {
      return res.status(404).send("Category not found.");
    }

    const existingSubCategory = category.subCategorySchema.find(
      subcategory => subcategory.subCategory_name === subCategory_name
    );

    if (existingSubCategory) {
      return res.status(400).send("subCategory already exists.");
    }

    const subcategory = new SubCategory({subCategory_name, category_id });

    category.subCategorySchema.push(subcategory);
    category.subCategories_names.push(subCategory_name);

    await Promise.all([subcategory.save(), category.save()]);

    res.status(201).send({ subcategory, message: "Subcategory created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the subcategory.");
  }
}


const deleteCategory = async (req, res)=>{
  const {category_id} = req.params;

  try {
    const category = await Category.findById(category_id);

    if (!category) {
      return res.status(404).send("Category not found.");
    }

    await SubCategory.deleteMany({ category_id });
    await category.deleteOne({ _id: category_id })

    res.status(200).send({ message: "Category deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the category.");
  }
};


const deleteSubCategory = async (req, res)=>{
  const {subCategory_id} = req.params;

  try {

    const subCategory = await SubCategory.findById(subCategory_id);

    if (!subCategory) {
      return res.status(404).send("subCategory not found.");
    }

    const subCategory_name = subCategory.subCategory_name;

    const category = await Category.findById(subCategory.category_id)

    category.subCategorySchema.pull({ _id: subCategory_id });
    category.subCategories_names.pull(subCategory_name);

    await Promise.all([
      category.save(),
      SubCategory.deleteOne({ _id: subCategory_id }),
    ]);

    res.status(200).send({ message: "Subcategory deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the subcategory.");
  }
};


module.exports = {
  createCategory,
  createSubCategory,
  deleteCategory,
  deleteSubCategory,
}


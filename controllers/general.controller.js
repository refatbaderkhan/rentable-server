const User = require("../models/user.model")
const {Item, Category, SubCategory} = require("../models/item.model")


const getItems = async (req, res)=>{
  try {
    const filter = {};
    const {category, subcategory, city, area, user_id, item_id} = req.query;

    if (category) filter["item_subcategory.category_name"] = category;
    if (subcategory) filter["item_subcategory.subcategory_name"] = subcategory;
    if (city) filter["item_location.city"] = city;
    if (area) filter["item_location.area"] = area;
    if (user_id) filter["user_id"] = user_id;
    if (item_id) filter["_id"] = item_id;
    if (minPrice && maxPrice) filter["item_price"] = {$gte: minPrice, $lte: maxPrice};
    if (minPrice) filter["item_price"] = {$gte: minPrice};
    if (maxPrice) filter["item_price"] = {$lte: maxPrice};

    const items = await Item.find(filter);
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send("An error occurred while getting the items.");
  }
}


const searchItems = async (req, res)=>{
  try {
    const {search} = req.query;

    if (!search) return res.status(400).send("No search query provided.");

    const items = await Item.find({item_name: {$regex: search, $options: "i"}});

    res.status(200).send(items);
  } catch (error) {
    res.status(500).send("An error occurred while searching for items.");
  }
}

const getUser = async (req, res)=>{
  const {user_id} = req.params;

  try {
    user = await User.findById(user_id);

    if (!user) return res.status(404).send("User not found.");

    

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("An error occurred while getting the user.");
  }
}

const getCategories = async (req, res)=>{

  try {
    const categories = await Category.find();

    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send("An error occurred while getting the categories.");
  }
}

module.exports = {
  getItems,
  searchItems,
  getUser,
  getCategories,
}

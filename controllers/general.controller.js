const User = require("../models/user.model")
const {Item, Category, SubCategory, City} = require("../models/item.model")


const getItems = async (req, res)=>{
  try {
    const items = await Item.find();

    res.status(200).send(items);
  } catch (error) {
    res.status(500).send("An error occurred while getting the items.");
  }
}


const getItem = async (req, res)=>{
  const {item_id} = req.params;

  try {
    const item = await Item.findById(item_id);

    if (!item) return res.status(404).send("Item not found.");

    res.status(200).send(item);
  } catch (error) {
    res.status(500).send("An error occurred while getting the item.");
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

    if (!user_id) {

      const users = await User.find();
      
      return res.status(200).send(users);
    }

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


const getCities = async (req, res)=>{
  try {
    const cities = await City.find();

    res.status(200).send(cities);
  } catch (error) {
    res.status(500).send("An error occurred while getting the cities.");
  }
}

module.exports = {
  getItems,
  getItem,
  searchItems,
  getUser,
  getCategories,
  getCities
}

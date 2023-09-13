const User = require("../models/user.model")
const {Item, Category, SubCategory, City} = require("../models/item.model")


const getUserItems = async (req, res)=>{
  const {user_id} = req.params;

  try {
    const user = await User.findById(user_id).populate("user_items");

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.status(200).send(user.user_items);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while getting the user's items.");
  }
}


const createItem = async (req, res)=>{
  const {
    item_name,
    item_description,
    item_price,
    item_category,
    item_subcategory,
    item_location
  }= req.body;
  console.log(req.body);
  const item_images = req.file ? [req.file.path] : [];
  const {username, _id, profile_picture} = req.user;

  try {

   const [checkCategory, checkSubcategory, checkCity, checkArea] = await Promise.all([
     Category.findOne({category_name: item_category}),
     SubCategory.findOne({subCategory_name: item_subcategory}),
    City.findOne({city_name: item_location.city}),
    City.findOne({areas: {$in: [item_location.area]}}),
   ]);

    if (!checkCategory || !checkSubcategory || !checkCity || !checkArea) {
      return res.status(400).send("Invalid category, subcategory");
    }

    const item = new Item({
      item_name,
      item_description,
      item_price,
      item_images,
      item_category : checkCategory._id,
      item_category_name: item_category,
      item_subcategory : checkSubcategory._id,
      item_subcategory_name: item_subcategory,
      item_location : {
        city: checkCity._id,
        city_name: item_location.city,
        area: item_location.area,
        latitude: item_location.latitude,
        longitude: item_location.longitude,
      },
      username,
      user_id: _id,
      user_profile_picture: profile_picture,
    });

    await item.save();

    await User.findByIdAndUpdate(_id, {
      $push: {
        user_items: item._id,
      },
    });

    res.status(201).send({item, message: "Item created successfully."});
  } catch (error) {
  console.log(error);
  res.status(500).send("An error occurred while creating the item.");
  }
}


module.exports = {
  getUserItems,
  createItem
}
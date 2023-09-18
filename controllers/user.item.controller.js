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
    item_city,
    item_area,
    item_latitude,
    item_longitude,
  }= req.body;

  const item_images = req.files ? req.files.map(file => file.filename) : "";

  const {username, _id, profile_picture} = req.user;

  try {

    const [checkCategory, checkSubcategory, checkCity, checkArea] = await Promise.all([
     Category.findOne({category_name: item_category}),
     SubCategory.findOne({subCategory_name: item_subcategory}),
     City.findOne({city_name: item_city}),
     City.findOne({areas: {$in: [item_area]}}),
    ]);

     if (!checkCategory || !checkSubcategory || !checkCity || !checkArea) {
       return res.status(400).send("Invalid category, subcategory, city, or area.");
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
        city_name: item_city,
        area: item_area,
        latitude: item_latitude,
        longitude: item_longitude,
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


const modifyItem = async (req, res)=>{
  const {item_id} = req.params;
  const {item_name, item_description, item_price, item_category, item_subcategory, item_location} = req.body;
  const {_id: user_id} = req.user;

  try {
    const item = await Item.findById(item_id);

    if (!item) {
      return res.status(404).send("Item not found.");
    }

    if (item.user_id.toString() !== user_id) {
      return res.status(401).send("You are not authorized to modify this item.");
    }
    
    if(item_name) item.item_name = item_name;
    if(item_description) item.item_description = item_description;
    if(item_price) item.item_price = item_price;
    if(item_category) {
      const checkCategory = await Category.findOne({category_name: item_category});
      if (!checkCategory) {
        return res.status(400).send("Invalid category.");
      }
      item.item_category = checkCategory._id;
      item.item_category_name = item_category;
    }
    if(item_subcategory) {
      const checkSubcategory = await SubCategory.findOne({subCategory_name: item_subcategory});
      if (!checkSubcategory) {
        return res.status(400).send("Invalid subcategory.");
      }
      item.item_subcategory = checkSubcategory._id;
      item.item_subcategory_name = item_subcategory;
    }
    if (item_location) {
      if (item_location.city) {
        const checkCity = await City.findOne({city_name: item_location.city});
        if (!checkCity) {
          return res.status(400).send("Invalid city.");
        }
        item.item_location.city = checkCity._id;
        item.item_location.city_name = item_location.city;
      }
      if (item_location.area) {
        const checkArea = await City.findOne({areas: {$in: [item_location.area]}});
        if (!checkArea) {
          return res.status(400).send("Invalid area.");
        }
        item.item_location.area = item_location.area;
      }
      if (item_location.latitude) item.item_location.latitude = item_location.latitude;
      if (item_location.longitude) item.item_location.longitude = item_location.longitude;
    }

    await item.save();

    res.status(200).send({item, message: "Item modified successfully."});
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while modifying the item.");
  }
}


const deleteItem = async (req, res)=>{
  const {item_id} = req.params;
  const {_id: user_id} = req.user;

  try {
    const item = await Item.findById(item_id);

    if (!item) {
      return res.status(404).send("Item not found.");
    }
    
    if (item.user_id.toString() !== user_id) {
      return res.status(401).send("You are not authorized to delete this item.");
    }

    const itemFavorites = await User.find({favorite_items: {$in: [item_id]}});
    for (const user of itemFavorites) {
      user.favorite_items.pull(item_id);
      await user.save();
    }

    const itemBookings = await User.find({bookings: {$in: [item_id]}});
    for (const user of itemBookings) {
      user.bookings.pull(item_id);
      await user.save();
    }
    
    await Item.deleteOne({_id:item_id})
    await User.findByIdAndUpdate(user_id, {$pull: {user_items: item_id}});

    res.status(200).send("Item deleted successfully.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while deleting the item.");
  }
}


module.exports = {
  getUserItems,
  createItem,
  modifyItem,
  deleteItem
}
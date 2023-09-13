const User = require("../models/user.model")
const Item = require("../models/item.model")


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


module.exports = {
  getItems
}

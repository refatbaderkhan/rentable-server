const {City} = require("../models/item.model")


const createCity = async (req, res)=>{
  const {city_name} = req.body;

  try {
    const city = new City({city_name});

    if (!city) {
      return res.status(400).send("City name is required.");
    }
    
    const existingCity = await City.findOne({ city_name });
    if (existingCity) {
      return res.status(400).send("City already exists.");
    }

    await city.save();

    res.status(201).send({ city, message: "City created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the city.");
  }
};


module.exports = {
  createCity
}


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


const createArea = async (req, res)=>{
  const {city_id} = req.params;
  const {area_name} = req.body;

  try {
    if (!city_id || !area_name) {
      return res.status(400).send("City ID and area name are required.");
    }

    const city = await City.findById(city_id);

    if (!city) {
      return res.status(404).send("City not found.");
    }
    
    const existingArea = city.areas.find(area => area === area_name);

    if (existingArea) {
      return res.status(400).send("Area already exists.");
    }

    city.areas.push(area_name);
    
    await city.save();

    res.status(201).send("Area created successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the area.");
  }
};


const deleteCity = async (req, res)=>{
  const {city_id} = req.params;

  try {
    const city = await City.findById(city_id);

    if (!city) {
      return res.status(404).send("City not found.");
    }

    await City.deleteOne({ _id: city_id });

    res.status(200).send({ message: "City deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the city.");
  }
};


const deleteArea = async (req, res)=>{
  const {city_id} = req.params;
  const {area_name} = req.body;

  try {
    const city = await City.findById(city_id);

    if (!city) {
      return res.status(404).send("City not found.");
    }

    const area = city.areas.find(area => area === area_name);

    if (!area) {
      return res.status(404).send("Area not found.");
    }

    city.areas.pull(area_name);

    await city.save();
    
    res.status(200).send({ message: "Area deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the area.");
  }
};


module.exports = {
  createCity,
  createArea,
  deleteCity,
  deleteArea
}


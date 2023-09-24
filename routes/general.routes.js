const express = require("express");
const router = express.Router();
const generalController = require("../controllers/general.controller");

router.get("/items", generalController.getItems)
router.get("/item/:item_id", generalController.getItem)
router.get("/account/:user_id?", generalController.getUser)
router.get("/categories", generalController.getCategories)
router.get("/cities", generalController.getCities)

module.exports = router;
const express = require("express");
const router = express.Router();
const generalController = require("../controllers/general.controller");

router.get("/items/:user_id/:item_id", generalController.getItems)
router.get("/account/:user_id?", generalController.getUser)
router.get("/categories", generalController.getCategories)
router.get("/cities", generalController.getCities)

module.exports = router;
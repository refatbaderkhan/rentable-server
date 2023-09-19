const express = require("express");
const router = express.Router();
const generalController = require("../controllers/general.controller");

router.get("/items/:user_id/:item_id", generalController.getItems)
router.get("/profile/:user_id", generalController.getUser)
router.get("/categories", generalController.getCategories)

module.exports = router;
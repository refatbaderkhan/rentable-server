const express = require("express");
const router = express.Router();
const adminUserController = require("../controllers/admin.user.controller");
const adminLocationController = require("../controllers/admin.location.controller");
const adminCategoryController = require("../controllers/admin.category.controller");


router.post("/update-password/:user_id", adminUserController.updateUserPassword);
router.delete("/delete-account/:user_id", adminUserController.deleteUserAccount);


router.post("/create-category", adminCategoryController.createCategory);
router.post("/create-subcategory/:category_id", adminCategoryController.createSubCategory);
router.delete("/delete-category/:category_id", adminCategoryController.deleteCategory);
router.delete("/delete-subcategory/:subCategory_id", adminCategoryController.deleteSubCategory);


router.post("/create-city", adminLocationController.createCity);
router.post("/create-area/:city_id", adminLocationController.createArea);
router.delete("/delete-city/:city_id", adminLocationController.deleteCity);
router.delete("/delete-area/:city_id", adminLocationController.deleteArea);


module.exports = router;
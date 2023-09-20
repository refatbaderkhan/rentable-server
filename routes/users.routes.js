const express = require("express");
const router = express.Router();
const userAccountController = require("../controllers/user.account.controller");
const userBookingController = require("../controllers/user.book.controller");
const userFavoriteController = require("../controllers/user.favorite.controller");
const userItemController = require("../controllers/user.item.controller");
const userRateController = require("../controllers/user.rate.controller");
const userChatController = require("../controllers/user.chat.controller");
const multer = require("multer");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    const timestamp = new Date().toISOString().split('.')[0].replace(/:/g, "_");
    const filename = `${timestamp}_${file.originalname}`;
    cb(null, filename);
  }
});


const upload = multer({ storage: storage });

router.get("/account", userAccountController.getAccount);

router.get("/items/:user_id", userItemController.getUserItems);
router.post("/create-item", upload.array("item_images", 6), userItemController.createItem)
router.post("/item/:item_id", userItemController.modifyItem);
router.delete("/item/:item_id", userItemController.deleteItem);

router.get("/bookings", userBookingController.getBookings);
router.post("/book/:item_id", userBookingController.bookItem);
router.delete("/book/:booking_id", userBookingController.deleteBooking);

router.get("/chat/:chat_users", userChatController.chat);
router.get("/chats", userChatController.getChats);
router.post("/message/:chat_id", userChatController.message);
router.get("/messages/:chat_id", userChatController.getChatMessages);

module.exports = router;
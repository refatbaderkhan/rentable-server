const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    const username = req.body.username;
    const timestamp = new Date().toISOString().split('.')[0].replace(/:/g, "-");
    const originalName = file.originalname;
    const extension = originalName.split(".").pop();
    const filename = `${username}_${timestamp}.${extension}`;
    cb(null, filename);
  }
});


const upload = multer({ storage: storage });


router.post("/login", authController.login)
router.post("/register", upload.single("profile_picture"), authController.register);


module.exports = router;
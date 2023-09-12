const {Category, SubCategory, Area, City} = require("../models/item.model")
const User = require("../models/user.model")
const Item = require("../models/item.model")
const bcrypt = require("bcrypt");


const updateUserPassword = async (req, res)=>{
  const {user_id} = req.params;
  const {new_password , admin_password} = req.body;
  const {_id: admin_user_id} = req.user;

  try {
    const admin = await User.findById(admin_user_id);

    const isCorrect = await bcrypt.compare(admin_password, admin.password);
    if (!isCorrect) {
      return res.status(401).send("Incorrect admin password.");
    }

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (user.user_type === 0) {
      return res.status(401).send("Admin password cannot be updated.");
    }

    hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).send({ message: "User password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the user password.");
  }
}


module.exports = {
  updateUserPassword
}


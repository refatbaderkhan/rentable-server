const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")


const login = async (req, res)=>{
    const {email, password} = req.body;
    try {
      const user = await User.findOne({email})
      if(!user) {
        return res.status(404).send({message: "email/password incorrect"});
      }

      const isValid = await bcrypt.compare(password, user.password);
      if(!isValid) {
        return res.status(404).send({message: "email/password incorrect"});
      }

      const {password: hashedPassword, username, _id, user_type, profile_picture, ...userInfo} = user.toJSON();
      const token = jwt.sign(
        {username, email, _id, user_type, profile_picture, ...userInfo},
        process.env.JWT_SECRET
      )

      res.send({
        token,
        user: 
          {_id, username, email, user_type, profile_picture, ...userInfo}
      })
    } catch (error) {
      console.error(error);
      res.status(500).send("An error oc curred while logging in.");
}
}


const register = async (req, res) => {
  const { password, username, first_name, last_name, email, city, area } = req.body;
  const profile_picture = req.file ? req.file.filename : "";

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).send("Username or email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      first_name,
      last_name,
      email,
      profile_picture,
      city,
      area,
      password: hashedPassword,
      user_type: 1
    });

    await user.save();

    res.status(201).send({ user, message: "Account created successfully." });
  } catch (error) {
    res.status(500).send("An error occurred while registering the user.");
  }
};


module.exports = {
  login,
  register
}
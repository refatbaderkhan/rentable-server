const User = require("../models/users.model")

const test = async (req, res)=>{
    res.send("Authenticated")
}

module.exports = {test}
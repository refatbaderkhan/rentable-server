const express = require("express")
const app = express();
require("dotenv").config()
const mongooseConnect = require("./configs/mongoDB.connect");
app.use(express.json())

app.listen(8000, (err)=>{
  if(err){
      console.error(err)
      return
  }
  console.log("server running on port: ", 8000)
  mongooseConnect()
})
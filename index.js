const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());

const mongooseConnect = require("./configs/mongoDB.connect");
require("dotenv").config();

const PORT = 8000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Server is running on port: ${PORT}`);
  mongooseConnect();
});

const express = require("express");
const connectDB = require("./db");
const userSchema = require('./models/Userschema')

const app = express();
const port = 5000;

connectDB();

app.get("/", (req, res) => {
  res.send("Hello I am home page...");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
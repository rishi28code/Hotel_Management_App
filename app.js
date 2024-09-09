const express = require("express");
const app = express();
const db = require("./db");
const passport = require('./auth')
require('dotenv').config();
const bodyParser = require("body-parser");
app.use(bodyParser.json());



// middleware function to print all actions we need time and date
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] Request Made to : ${req.originalUrl}`);
  next(); // Move on to the next phase
};

// Person routes
const personRoutes = require("./routes/personRoutes");
const menuRoutes = require("./routes/menuItemRoutes");

const PORT = 3000;

app.use(logRequest);


//initializing passport
app.use(passport.initialize())
const authMiddleware = passport.authenticate('local',{session:false})


app.get("/", (req, res) => {
  res.send("hi there");
});
app.get("/idle", (req, res) => {
  var custom_idle = {
    name: "rava idle",
    is_sambar: true,
    is_chutney: false,
  };
  res.send(custom_idle);
});

app.use("/person", personRoutes);
app.use("/menu", menuRoutes);

app.listen(PORT, () => {
  console.log("server started");
});

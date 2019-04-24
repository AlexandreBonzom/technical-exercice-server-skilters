//to put as early as possible
require("dotenv").config();
// Import of express to create a server
const express = require("express");
const app = express();

//import cors
/* TO DO : parameter correctly cors options*/
const cors = require("cors");
app.use(cors());

// security helmet with default protection
const helmet = require("helmet");
app.use(helmet());

//import DB/Connection
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/userSkilters", { useNewUrlParser: true });

//parse request bodies as req.body
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//import Routes
const userRoutes = require("./Routes/userRoute.js");
app.use("/user", userRoutes);

app.listen(3000, () => {
  console.log("Server launche on port 3000");
});

const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const multer = require("multer");
const authRoutes = require("./routes/auth");

//Config
const app = express();
dotenv.config();
const port = process.env.PORT || 5001;
app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routes
app.use("/api/v1/auth", authRoutes);

//Database Connection
connectDB();

//starting the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

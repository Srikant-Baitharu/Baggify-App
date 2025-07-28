const express = require('express');
const app = express();
const colors = require('colors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDb = require('./config/db.js');
const ownerRoutes = require("./routes/ownerRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const productsRoutes = require("./routes/productsRoutes.js");
require('dotenv').config();


const cookieParser = require("cookie-parser");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");


//DB connection
const startServer = async () => {
  try {
    await connectDb();

    //middlewares

    // Routes
    app.use('/owners',ownerRoutes);
    app.use('/users',userRoutes);
    app.use('/products',productsRoutes);
    app.get('/', (req, res) => {
      return res.status(200).send("<h1>Welcome to scratch app</h1>");
    });

    //PORT
    const PORT = process.env.PORT || 8080

    //Start Server
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`.white.bgMagenta);
    })
  } catch (error) {
    console.log('Error:', error);
  }
}

startServer();
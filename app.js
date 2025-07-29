const express = require('express');
const app = express();
const colors = require('colors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDb = require('./config/db.js');
const ownerRoutes = require("./routes/ownerRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const productsRoutes = require("./routes/productsRoutes.js");
const { isLoggedIn } = require('./middlewares/isLoggedIn');
const flash = require("connect-flash");
const expressSession = require("express-session");
const Product = require('./models/productModel.js');
const indexRouter = require("./routes/index.js");
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
    app.use(
      expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET,
      })
    )
    app.use(flash());
    // Routes
    app.use('/owners',ownerRoutes);
    app.use('/users',userRoutes);
    app.use('/products',productsRoutes);
    app.get('/', (req, res) => {
      const [error] = req.flash('error');
      res.render('index', { error });
    });

    app.use('/',indexRouter);
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
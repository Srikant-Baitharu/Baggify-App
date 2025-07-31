require('dotenv').config();

const express = require('express');
const app = express();
const colors = require('colors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDb = require('./config/db.js');
const ownerRoutes = require("./routes/ownerRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const productsRoutes = require("./routes/productsRoutes.js");
const paymentRoutes = require('./routes/paymentRoutes.js')
const { isLoggedIn } = require('./middlewares/isLoggedIn');
const flash = require("connect-flash");
const expressSession = require("express-session");
const Product = require('./models/productModel.js');
const indexRouter = require("./routes/index.js");
const userModel = require('./models/userModel.js')
const Razorpay = require("razorpay");




const cookieParser = require("cookie-parser");
const path = require("path");
const setLoggedin = require('./middlewares/setLoggedin.js');

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
    app.use(setLoggedin);
    // Routes
    app.use('/owners',ownerRoutes);
    app.use('/users',userRoutes);
    app.use('/products',productsRoutes);
    app.use('/owners',productsRoutes)
    app.get('/', (req, res) => {
      const [error] = req.flash('error');
      res.render('index', { error, isLoggedIn: false });
    });

    app.use('/',indexRouter);
    app.use('/',isLoggedIn,paymentRoutes);

    app.get("/checkout", isLoggedIn, async (req, res) => {
      const user = await userModel.findOne({ email: req.user.email }).populate("cart");
      let subtotal = 0;
      user.cart.forEach(item => {
          subtotal += item.price;
      });

      const platformFee = 20;
      const bill = subtotal +platformFee;

      res.render("checkout", {
        subtotal,
        platformFee,
        bill,
        razorpayKey: process.env.RAZORPAY_ID_KEY
      });
  });


app.post("/checkout", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email }).populate("cart");
    let subtotal = 0;
    user.cart.forEach(item => {
      subtotal += item.price;
    });

    const platformFee = 20;
    const bill = subtotal+platformFee;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_ID_KEY,
      key_secret: process.env.RAZORPAY_SECRET_KEY
    });

    const options = {
      amount: bill * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await instance.orders.create(options);

    res.render("checkout",{
      subtotal,
      platformFee,
      bill,
      orderId: order.id,
      razorpayKey: process.env.RAZORPAY_ID_KEY,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send("Something went wrong while processing payment.");
  }
});

  

    app.post("/remove-from-cart/:id", isLoggedIn, async (req, res) => {
      let user = await userModel.findOne({ email: req.user.email });
      user.cart = user.cart.filter(item => item && item._id && item._id.toString() !== req.params.id);
      await user.save();
      res.redirect("/cart");
    });

    app.post("/update-quantity/:id", isLoggedIn, async (req, res) => {
      const user = await userModel.findOne({ email: req.user.email });
      const itemId = req.params.id;
      const action = req.query.action;
    
      user.cart.forEach(item => {
          if (item && item._id.toString() === itemId) {
              if (!item.quantity) item.quantity = 1;
              if (action === "increase") item.quantity += 1;
              if (action === "decrease" && item.quantity > 1) item.quantity -= 1;
          }
      });
  
      await user.save();
      res.redirect("/cart");
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
const express = require("express");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const router = express.Router();
const Product = require("../models/productModel");
const productModel = require("../models/productModel");

//router.get('/',(req,res)=>{
  //  let error = req.flash('error');
    //res.render("index",{ error });
//});

router.get('/shop', isLoggedIn, async (req, res) => {
      try {
        const products = await productModel.find();  // Fetch products from DB
        res.render('shop', { products });       // Send to shop.ejs
      } catch (err) {
        console.error("Error loading products:", err);
        res.status(500).send('Internal Server Error');
      }
    });

router.get('/logout',isLoggedIn,(req,res)=>{
    res.render("shop");
})



module.exports = router;
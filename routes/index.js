const express = require("express");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const router = express.Router();
const Product = require("../models/productModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");


router.get('/shop', isLoggedIn, async (req, res) => {
      try {
        const products = await productModel.find();
        let success =req.flash("success"); // Fetch products from DB
        res.render('shop', { products, success });       // Send to shop.ejs
      } catch (err) {
        console.error("Error loading products:", err);
        res.status(500).send('Internal Server Error');
      }
});

router.get("/cart",isLoggedIn,async (req,res)=>{
  let user = await userModel.findOne({ email: req.user.email }).populate("cart");

  const bill = (Number(user.cart[0].price)+20)-Number(user.cart[0].discount)
  
  res.render("cart", { user, bill });
})

router.get('/addtocart/:productid',isLoggedIn,async (req,res)=>{
    let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success","Added to cart");
    res.redirect("/shop");
})


router.get('/logout',isLoggedIn,(req,res)=>{
    res.render("shop");
})



module.exports = router;
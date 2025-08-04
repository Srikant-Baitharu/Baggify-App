const express = require('express');
const router = express.Router();
const ownerModel = require("../models/ownerModel")
const productModel = require('../models/productModel')

//router.get('/', (req,res) => {
  //  res.send("hey its working");
//})

router.post('/create', async (req,res) => {
    let owners = await ownerModel.find();
    if(owners.length > 0) {
        return res
            .status(500)
            .send("You don't have permission to create a new owner");
    }

    let {fullname,email,password} = req.body
    let createdOwner = await ownerModel.create({
        fullname,
        email,
        password,
    })
    res.status(201).send(createdOwner);
})

router.get('/admin',async (req,res)=>{
    try {
        const success = req.flash("success");
        const products = await productModel.find();
        res.render('createproducts', { success, products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Server Error");
    }
})

router.post('/products/delete/:id', async (req, res) => {
    const productId = req.params.id;
    const product = await productModel.findById(productId);

    if (!product) {
        return res.status(404).send("Product not found");
    }

    await productModel.findByIdAndDelete(productId);
    req.flash('success', 'Product deleted successfully');
    res.redirect('/owners/admin'); // match your actual route
});


module.exports = router;


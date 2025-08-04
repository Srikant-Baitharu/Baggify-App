const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config')
const productModel = require('../models/productModel')

router.post('/products/create', upload.single("image"),async(req,res) => {
    try {
        let { name, price, discount,bgcolor, panelcolor, textcolor} = req.body;
        let product = await productModel.create({
        image: "uploads/" + req.file.filename,
        name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor,
    })
    req.flash("success","Product Created Successfully")
    res.redirect("/owners/admin");
    } catch (err) {
        res.send(err.message);   
    }
})

// GET update form
router.get("/products/update/:id", async (req, res) => {
    const product = await productModel.findById(req.params.id);
    res.render("updateproduct", { product });
  });
  
  // POST update form
  router.post("/products/update/:id", upload.single("image"), async (req, res) => {
    const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;
  
    let updateData = {
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
    };
  
    // If new image uploaded
    if (req.file) {
      updateData.image = "uploads/" + req.file.filename;
    }
  
    await productModel.findByIdAndUpdate(req.params.id, updateData);
    req.flash("success", "Product updated successfully!");
    res.redirect("/owners/admin");
  });

module.exports = router;


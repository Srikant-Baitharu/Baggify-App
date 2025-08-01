const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const userModel = require('../models/userModel');
const { isLoggedIn } = require('../middlewares/isLoggedIn')

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, req.user._id + '_profile' + ext);
  }
});

const upload = multer({ storage });

// GET /account
router.get('/myaccount', isLoggedIn, async (req, res) => {
  const user = await userModel.findById(req.user._id);
  res.render('myaccount', { user });
});

// POST /upload-profile
router.post('/upload-profile', isLoggedIn, upload.single('profileImage'), async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        user.picture = req.file.filename; // ✅ use `picture` here
        await user.save();
        res.redirect('/myaccount');
      } catch (err) {
        console.error(err);
        res.status(500).send("Upload failed");
      }
});

module.exports = router;

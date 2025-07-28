const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken')

module.exports.registerUser = async(req,res) => {
    try {
      let { email, password, fullname } = req.body;

      let user = await userModel.findOne({email:email});
      if(user) return res.status(401).send("You already have an account, please login")
  
      bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, async(err, hash) => {
              if(err) return res.send(err.message);
              else{
                  let user = await userModel.create({
                      email,
                      password: hash,
                      fullname,
                  });
  
                  let token = generateToken(user);
                  res.cookie("token",token);
                  res.status(200).send({
                      success: true,
                      message: "User created successfully",
                      user,
                  })
              }
          })
      })
  
    } catch (error) {
          res.status(401).send({
              success: false,
              message: "Error in register API",
              error
          })
    }  
  }
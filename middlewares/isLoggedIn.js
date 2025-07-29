const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const isLoggedIn = async (req, res, next) => {
    if(!req.cookies.token){
        req.flash("Error","You need to login first");
        return res.redirect('/');
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        let user = await userModel
            .findOne({ email: decoded.email })
            .select("-password");

        req.user = user;

        next();
    } catch (err) {
        req.flash("error","Something Went Wrong.");
        res.redirect("/");
    }
}

module.exports = {
    isLoggedIn,
}
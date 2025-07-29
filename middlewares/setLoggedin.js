const jwt = require("jsonwebtoken");

const setLoggedin = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      res.locals.user = user;
      res.locals.loggedin = true;
    } catch (err) {
      res.locals.loggedin = false;
    }
  } else {
    res.locals.loggedin = false;
  }
  next();
};

module.exports = setLoggedin;

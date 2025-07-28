const express = require('express');
const app = express();

const cookieParser = require("cookie-parser");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.send("hey");
});

//PORT
const PORT = process.env.PORT || 8080

//listen
app.listen(PORT, () => {
  console.log(`Sserver running on ${PORT}`.white.bgMagenta);
})
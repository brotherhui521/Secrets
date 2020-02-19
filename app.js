//jshint esversion:6
//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const functions = require(__dirname + "/functions.js");
const encryption=require("mongoose-encryption");

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/userDb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema=new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encryption,{secret: process.env.SECRET, encryptedFields: ["password"]});
const User=new mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
})
app.get("/register", function(req, res){
    res.render("register");
})
app.get("/login", function(req, res){
    res.render("login");
})

app.post("/register", function(req,res){
    const newUser=new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if(err){
            res.send(err);
        }else{
            res.redirect("/login");
        }
    })
})

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email: username},function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if (foundUser.password==password){
                res.render("secrets");
            }
            else{
                res.redirect("/login");
            }
        }
    })
})


app.listen(3000, function(){
    console.log("Listen on PORT 3000");
})
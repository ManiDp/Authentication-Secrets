require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser : true}); 

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Adding the Encrytion Plugin

userSchema.plugin(encrypt, {requireAuthenticationCode:false, secret: process.env.SECRET, encryptedFields : ["password"]});

const User = new mongoose.model("User",userSchema);

app.get("/", function(req,res){
    res.render('home.ejs');
})

app.get("/login", function(req,res){
    res.render('login.ejs');
})

app.get("/register", function(req,res){
    res.render('register.ejs');
})


app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save().then(function(){
        res.render('secrets');
    }).catch(function(err){
        console.log(err);
    });
});


app.post("/login", function(req, res){
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({email : userName}).then(function(foundUser){
        if(foundUser.password === password){
            res.render('secrets');
        }else{
            console.log("Check the Password");
        }
    }).catch({function(err){
        console.log(err);
    }}) 
})




app.listen(3000, function(){
    console.log("server started on the Port 3000");
})

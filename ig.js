const express = require("express");
let app = express();
const path = require("path");
var mongoose = require("mongoose");

app.use(express.static(__dirname + '/public'));

app.set("views", [path.join(__dirname, "views"),
                    path.join(__dirname, "views/Login_Form"),
                    path.join(__dirname, "views/Forget_password"),
                    path.join(__dirname, "views/Sign_Up"),
                    path.join(__dirname, "views/Team"),
                    path.join(__dirname, "views/column")]);

app.set("view engine", "ejs");


app.get("/", function(req,res){
    res.render("landing");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/login/forgetpsswd", function(req,res){
    res.render("forget_psw");
});

app.get("/Sign_up", function(req,res){
    res.render("SignUp");
});

app.get("/Sign_up/acception", function(req,res){
    res.render("acception");
});

app.get("/team", function(req,res){
    res.render("team");
});

app.get("/team/create", function(req,res){
    res.render("c_team");
});

app.get("/subject", function(req,res){
    res.render("column");
});

app.get("/subject/create", function(req,res){
    res.render("c_column");
});


app.get("/home", function(req,res){
    res.render("home");
});

app.listen(3000, function(req,res){
    console.log("Server have started!!");
});

const express = require("express");
let app = express();
const path = require("path");

app.use(express.static(__dirname + '/public'));

app.set("views", [path.join(__dirname, "views"),
                    path.join(__dirname, "views/Login_Form"),
                    path.join(__dirname, "views/Forget_password"),
                    path.join(__dirname, "views/Sign_Up"),
                    path.join(__dirname, "views/Team"),
                    path.join(__dirname, "views/column")]);

app.set("view engine", "ejs");


app.get("/", function(req,res){
    res.render("login");
});

app.get("/Sign_up", function(req,res){
    res.render("SignUp");
});

app.get("/team/create", function(req,res){
    res.render("c_team");
});

app.get("/subject/create", function(req,res){
    res.render("c_column");
});

app.listen(3000, function(req,res){
    console.log("Server have started!!");
});
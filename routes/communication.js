const express = require("express"),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user'),
    Communication = require('../models/commu'),
    middleware = require('../middleware');

router.get("/", function(req,res){
    res.render("column");
});

router.get("/create", function(req,res){
    res.render("c_column");
});

router.get("/type", function(req,res){
    res.render("column_game_type");
});

router.get("/detail", function(req,res){
    res.render("column_detail");
});

router.post("/create", middleware.isLoggedIn, function(req,res){
    let n_head = req.body.headline;
    let n_content = req.body.content;
    let n_user_post = {id: req.user._id, alias: req.user.alias};
    let n_game = req.body.game;
    var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
    let n_date = new Date(asiaTime).toISOString();
    let n_post = {head:n_head, content:n_content, user_post:n_user_post, game:n_game, date: n_date};
    Communication.create(n_post, function(error, newCommu){
        if(error){
            console.log("error create commu");
        }
        else{
            console.log(newCommu);
            res.redirect("/commu");
        }
    })
})

router.get("/:id", function(req,res){
    Communication.findById(req.params.id, function(error, idTeam){
        if(error){
            console.log("ERROR");
            
        } else{
            res.render("commu",{commu:idCommu});
            }
        }
    )}
)

router.delete("/:id", middleware.checkOwner, function(req,res){
    Communication.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("error to delete commu");
            res.redirect("/commu");
        }
        res.redirect("/commu");
    });
})


module.exports = router;

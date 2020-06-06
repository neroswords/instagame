const express = require("express"),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user'),
    News = require('../models/news'),
    middleware = require('../middleware');

    router.get("/", function(req,res){
        News.find({}, function(error, allNews){
            if(error){
                console.log("Error!!");
                
            }else{
                res.render("all_news",{News : allNews});
            }
        })
    })

    router.get("/detail", function(req,res){
        res.render("news");
    });

    router.get("/create", middleware.isLoggedIn, function(req,res){
        res.render("c_news");
    })

    router.post("/create", middleware.isLoggedIn, function(req,res){
        let n_head = req.body.headline;
        let n_content = req.body.content;
        let n_user_post = {id: req.user._id, alias: req.user.alias};
        let n_game = req.body.game;
        var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
        let n_date = new Date(asiaTime).toISOString();
        let n_post = {head:n_head, content:n_content, user_post:n_user_post, game:n_game, date: n_date};
        News.create(n_post, function(error, newNews){
            if(error){
                console.log("error create news");
            }
            else{
                console.log(newNews);
                res.redirect("/news");
            }
        })
    })

    router.get("/:id", function(req,res){
        News.findById(req.params.id, function(error, idNews){
            if(error){
                console.log("ERROR");
                
            } else{
                res.render("news",{news:idNews});
                }
            }
        )}
    )

    router.delete("/:id", middleware.checkNewsOwner, function(req,res){
        News.findByIdAndRemove(req.params.id, function(err){
            if(err){
                console.log("error to delete news");
                res.redirect("/news");
            }
            res.redirect("/news");
        });
    })


module.exports = router;


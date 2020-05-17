const express = require("express"),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user'),
    News = require('../models/news'),
    middleware = require('../middleware');

    router.get("/", function(req,res){
        res.render("");
    })

    router.get("/c_news", middleware.isLoggedIn, function(req,res){
        res.render("");
    })

    router.post("/c_news", middleware.isLoggedIn, function(req,res){
        let n_head = req.body.head;
        let n_content = req.body.n_content;
        let n_user_post = req.user;
        let n_game = req.body.game;
        let n_post = {head:n_head, content:n_content, user_post:n_user_post, game:n_game};
        News.create(n_post, function(error, newNews){
            if(error){
                console.log("error create news");
            }
            else{
                console.log("New content");
                res.redirect("/news");
            }
        })
    })

    router.get("/:id", function(req,res){
        News.findById(req.params.id, function(error, idNews){
            if(error){
                console.log("ERROR");
                
            } else{
                res.render("");
                }
            }
        )}
    )




module.exports = router;
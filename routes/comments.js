const express = require('express'),
    router = express.Router({mergeParams : true}),
    multer = require('multer'),
    path = require('path'),
    fs = require('fs'),
    passport = require('passport'),
    User = require('../models/user'),
    Communication = require('../models/commu'),
    Comment = require('../models/comment'),
    Team = require('../models/team'),
    News = require('../models/news'),
    middleware = require('../middleware');

    var moment = require('moment');

router.post('/create', middleware.isLoggedIn, function(req, res){
    if(req.params.models === "news"){
        News.findById(req.params.id, function(err, foundNews){
            if(err){
                console.log(err);
            } else{
                Comment.create(req.body.comment, function(err,comment){
                    if(err){
                        console.log(err);
                    } else {
                        comment.user_post.id = req.user._id;
                        comment.user_post.alias = req.user.alias;
                        comment.user_post.image = req.user.image;
                        var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
                        let n_date = new Date(asiaTime).toISOString();
                        comment.date = n_date;
                        comment.save();
                        foundNews.comments.push(comment);
                        foundNews.save();
                        res.redirect("back");
                    }
                })
            }
        })
    }
    else if(req.params.models === "commu"){
        Communication.findById(req.params.id, function(err, foundCommu){
            if(err){
                console.log(err);
            } else{
                Comment.create(req.body.comment, function(err,comment){
                    if(err){
                        console.log(err);
                    } else {
                        comment.user_post.id = req.user._id;
                        comment.user_post.alias = req.user.alias;
                        comment.user_post.image = req.user.image;
                        var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
                        let n_date = new Date(asiaTime).toISOString();
                        comment.date = n_date;
                        comment.save();
                        foundCommu.comments.push(comment);
                        foundCommu.save();
                        res.redirect("back");
                    }
                })
            }
        })
    }
    else if(req.params.models === "team"){
        Team.findById(req.params.id, function(err, foundTeam){
            if(err){
                console.log(err);
            } else{
                Comment.create(req.body.comment, function(err,comment){
                    if(err){
                        console.log(err);
                    } else {
                        comment.user_post.id = req.user._id;
                        comment.user_post.alias = req.user.alias;
                        comment.user_post.image = req.user.image;
                        var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
                        let n_date = new Date(asiaTime).toISOString();
                        comment.date = n_date;
                        comment.save();
                        foundTeam.comments.push(comment);
                        foundTeam.save();
                        res.redirect("back");
                    }
                })
            }
        })
    }
    
})

router.delete("/:comment_id", middleware.checkCommentOwner, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back'); 
        } else {
            res.redirect('/'+ req.params.models +'/'+ req.params.id);
        }
    });
});


module.exports = router;
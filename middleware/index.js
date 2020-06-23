const User = require("../models/user"),
    News = require("../models/news"),
    Comment = require("../models/comment"),
    Commu = require("../models/commu"),
    Review = require("../models/review"),
    Team = require("../models/team");

let middlewareObj = {};

middlewareObj.checkNewsOwner = function(req,res,next){
    if(req.isAuthenticated()){
        News.findById(req.params.id, function(err, foundNews){
            if(err){
                console.log("can not find news");
                res.redirect("back");
            } else{
                if(foundNews.user_post.id.equals(req.user._id) || req.user.class === "King"){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("back");
    }
}

middlewareObj.checkReviewOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Review.findById(req.params.id, function(err, foundReview){
            if(err){
                console.log("can not find review");
                res.redirect("back");
            } else{
                if(foundReview.user_post.id.equals(req.user._id) || req.user.class === "King"){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("back");
    }
}

middlewareObj.checkCommuOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Commu.findById(req.params.id, function(err, foundCommu){
            if(err){
                console.log("can not find Commu");
                res.redirect("back");
            } else{
                console.log(foundCommu);
                
                if(foundCommu.user_post.id.equals(req.user._id) || req.user.class === "King"){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("back");
    }
}

middlewareObj.checkTeamOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Team.findById(req.params.id, function(err, foundParty){
            if(err){
                console.log("can not find Party");
                res.redirect("back");
            } else{
                console.log(foundParty);
                
                if(foundParty.user_post.id.equals(req.user._id) || req.user.class === "King"){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log("can not find comment");
                res.redirect("back");
            } else{
                console.log(foundComment);
                
                if(foundComment.user_post.id.equals(req.user._id) || req.user.class === "King"){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to login first');
    res.redirect('/login');
}

middlewareObj.checkO = function(req,res,next){
    if(req.isAuthenticated()){
        if(req.user.class === "King"){
            return next();
        }
    }
    req.flash('error', 'You need to login first');
    res.redirect('/login');
}

middlewareObj.checkTu = function(req,res,next){  //Top User
    if(req.isAuthenticated()){
        User.findById(req.user._id, function(err, foundUser){
            if(err){
                console.log("can not find User");
                res.redirect("back");
            } else{
                if(foundUser.class === "Noble" || foundUser.class === "King"){
                    next();
                }else{
                    req.flash('error', "ONLY THE CHOSEN ONE CAN CREATE THE NEWS... WHO ARE YOU!!?")
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("back");
    }
}

module.exports = middlewareObj;
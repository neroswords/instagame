const User = require("../models/user"),
    News = require("../models/news"),
    Comment = require("../models/comment"),
    Commu = require("../models/commu"),
    Team = require("../models/team");

let middlewareObj = {};

middlewareObj.checkNewsOwner = function(req,res,next){
    if(req.isAuthenticated()){
        News.findById(req.params.id, function(err, foundNews){
            if(err){
                console.log("can not find news");
                res.redirect("back");
            } else{
                console.log(foundNews);
                
                if(foundNews.user_post.id.equals(req.user._id)){
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
                
                if(foundCommu.user_post.id.equals(req.user._id)){
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
                
                if(foundParty.user_post.id.equals(req.user._id)){
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
                
                if(foundComment.user_post.id.equals(req.user._id)){
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

module.exports = middlewareObj;
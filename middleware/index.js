const User = require("../models/user"),
    News = require("../models/news");

let middlewareObj = {};

middlewareObj.checkOwner = function(req,res,next){
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

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to login first');
    res.redirect('/login');
}

module.exports = middlewareObj;
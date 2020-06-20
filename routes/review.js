const tag = require("../models/tag");

const express = require("express"),
    router = express.Router(),
    multer = require('multer'),
    path = require('path'),
    fs = require('fs'),
    passport = require('passport'),
    User = require('../models/user'),
    Review = require('../models/review'),
    middleware = require('../middleware'),
    Tag = require('../models/tag'),
    async = require('async');

var moment = require('moment');     
const { populate } = require("../models/user");

const storage = multer.diskStorage({
    destination : './public/uploads/review',
    filename : function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const imageFilter = function(req, file, cb){
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.gif'){
        return cb(new Error('Only image is allow to upload'),false)
    }
    cb(null, true);
}

const upload = multer({storage : storage, fileFilter : imageFilter});

    router.get("/", function(req,res){
        Review.find({}, function(error, allReview){
            if(error){
                console.log("Error!!");
                
            }else{
                res.render("review",{Review : allReview, moment: moment});
            }
        })
    })

    router.get("/create", middleware.isLoggedIn, function(req,res){
        res.render("");
    })

    router.post("/create", middleware.isLoggedIn, upload.single('image'), function(req,res){
        let n_head = req.body.headline;
        let n_content = req.body.content;
        let n_image = req.file.filename;
        let n_viewers = 1;
        let n_user_post = {id: req.user._id, alias: req.user.alias};
        var n_game = req.body.game;
        var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
        let n_date = new Date(asiaTime).toISOString();
        let n_post = {head:n_head, content:n_content, viewers : n_viewers, user_post:n_user_post, game:n_game, date: n_date, image : n_image};
        News.create(n_post, async function(error, newReview){
            if(error){
                console.log("error create news");
            }
            else{
                var tagsarr = req.body.tags.split(',');
                for await (let tag of tagsarr) {
                    Tag.find({ name : tag },async function(err, findTag){
                        if(err){
                            console.log(err);
                        } else if(!findTag.length){
                            let n_tag = {name : tag}
                            Tag.create(n_tag,async function(error, newTag){
                                if(error){
                                    console.log(error);
                                } else {
                                    console.log("dont find");    
                                    newReview.tags.push(newTag._id);
        
                                }
                            })
                        } else {
                            console.log("find");
                            await newReview.tags.push(findTag[0]._id);
                        }    
                    }) 
                    
                }; 
                Tag.find({ name: n_game },async function(err,findGame){
                    if(err){
                        console.log(err);
                        
                    } else if(!findGame.length){
                        let game_tag = { name : n_game};
                        Tag.create(game_tag,async function(error, gameTag){
                            await newReview.tags.push(gameTag);
                            newReview.save();
                        })
                    } else if(findGame.length){
                        await newReview.tags.push(findGame[0]);
                        newReview.save();
                    }
                })
                
            }
            res.redirect("");
        })
    })

    router.get("/:id", function(req,res){
        Review.findById(req.params.id).populate('comments').populate('tags').exec( function(error, idReview){
            if(error){
                console.log("ERROR");
                
            } else{
                idReview.viewers++;
                idReview.save();
                res.render("news",{Review:idReview, moment: moment});
                }
            }
        )}
    )

    router.get("/:id/edit", middleware.checkReviewOwner, function(req,res){
        Review.findById(req.params.id, function(err, foundReview){
            if(err){
                console.log(err);
                
            } else {
                res.render("", {Review : foundReview})
            }
        })
    })

    router.put("/:id", middleware.checkReviewOwner, upload.single('image'), function(req, res){
        let n_head = req.body.head;
        let n_content = req.body.content;
        if(req.file){
            let n_image = req.file.filename;
            console.log(n_image);
            Review.findById(req.params.id, function(err, foundReview){
                if(err){
                    console.log(err);
                    res.redirect('/review/'+ req.params.id)
                } else{
                    const imagePath = './public/uploads/review/' + foundReview.image;
                    fs.unlink(imagePath, function(err){
                        if(err){
                            console.log(err);
                            res.redirect('/review');
                        }
                    })
                }
            })
            var n_reviews = {head : n_head, image : n_image, content : n_content}
        } else {
            var n_reviews = {head : n_head, content : n_content}
        }
        Review.findByIdAndUpdate(req.params.id, n_reviews, function(err, updateReview){
            if(err){
                console.log(err);
                
            } else {
                res.redirect('/review/' + req.params.id);
            }
        })
    })

    router.delete("/:id", middleware.checkReviewOwner, function(req,res){
        Review.findById(req.params.id, function(err, foundReview){
            if(err){
                console.log(err);
                res.redirect('/news/'+ req.params.id)
            } else{
                const imagePath = './public/uploads/review/' + foundReview.image;
                fs.unlink(imagePath, function(err){
                    if(err){
                        console.log(err);
                        res.redirect('/review');
                    }
                })
            }
        })
        Review.findByIdAndRemove(req.params.id, function(err){
            if(err){
                console.log("error to delete news");
                res.redirect("/news");
            }
            res.redirect("/review");
        });
    })


module.exports = router;
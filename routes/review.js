const tag = require("../models/tag");

const express = require("express"),
    router = express.Router(),
    multer = require('multer'),
    path = require('path'),
    fs = require('fs'),
    passport = require('passport'),
    User = require('../models/user'),
    Community = require('../models/commu'),
    Comment = require('../models/comment'),
    Team = require('../models/team'),
    News = require('../models/news'),
    Review = require('../models/review'),
    Tag = require('../models/tag'),
    middleware = require('../middleware');

var moment = require('moment');     

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
        }).sort({date : -1})
    })

    router.get("/category/:category", function(req,res){
        var n_type = req.params.category;
        Tag.find({name : n_type}, function(err, foundtag){
            if(err){
                console.log(err);
            } else {
                Review.find({tags : {$in : foundtag}}, function(error, someReview){
                    if(error){
                        console.log(error);
                        
                     }else {
                        res.render("review",{Review : someReview, moment: moment});
                    }
                }).sort({date : -1});
        }
    })
})

    router.get("/create", middleware.isLoggedIn, function(req,res){
        res.render("c_review");
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
        Review.create(n_post, async function(error, newReview){
            if(error){
                console.log("error create news");
            }
            else{
                var n_type_tag = "tag";
                var n_type_game = "game";
                var n_view = 1;
                var tagsarr = req.body.tags.split(',');
                await tagsarr.push(req.body.type);
                for await (let tag of tagsarr) {
                    Tag.find({ name : tag },async function(err, findTag){
                        if(err){
                            console.log(err);
                        } else if(!findTag.length){
                            let n_tag = {name : tag, type : n_type_tag ,view :n_view}
                            Tag.create(n_tag,async function(error, newTag){
                                if(error){
                                    console.log(error);
                                } else {
                                    console.log("dont find");    
                                    newReview.tags.push(newTag._id);
        
                                }
                            })
                        } else {
                            findTag[0].view++;
                            findTag[0].save();
                            await newReview.tags.push(findTag[0]._id);
                        }    
                    }) 
                    
                }; 
                Tag.find({ name: n_game },async function(err,findGame){
                    if(err){
                        console.log(err);
                        
                    } else if(!findGame.length){
                        let game_tag = { name : n_game , type : n_type_game ,view :n_view};
                        Tag.create(game_tag,async function(error, gameTag){
                            await newReview.tags.push(gameTag);
                            newReview.save();
                        })
                    } else if(findGame.length){
                        await newReview.tags.push(findGame[0]);
                        findGame[0].view++;
                        findGame[0].save();
                        newReview.save();
                    }
                })
                
            }
            res.redirect("/review");
        })
    })

    
    router.get("/:id", function(req,res){
        Review.findById(req.params.id).populate('comments').populate('tags').exec( function(error, idReview){
            if(error){
                console.log("ERROR");
                
            } else{
                    idReview.viewers++;
                    idReview.save();
                    var n_type_game = "game";
                    Tag.find({type : n_type_game}, function(err, hotGame){
                        Review.find({tags : {$in : hotGame }}, function(err,HOTGAME){
                            var n_hotgame = HOTGAME;
                            Tag.find({name : idReview.game}, function(err,foundTag){
                                News.find({tags : {$in : foundTag }}, function(err,foundrelateNews){
                                    var n_News = foundrelateNews;
                                        Community.find({tags : {$in : foundTag }}, function(err,foundrelateCommu){
                                            var n_Commu = foundrelateCommu;
                                                res.render("review_detail",{
                                                    review : idReview, 
                                                    moment: moment, 
                                                    reCommu : n_Commu,  
                                                    reNews : n_News, 
                                                    hotgames : n_hotgame});
            
                                        }).sort({date : -1}).limit(4);   
                                }).sort({date : -1}).limit(6);
                            })  
                        })
                    }).sort({view : -1}).limit(4);
                }
            }
        )
    }
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

    router.delete("/:id", middleware.checkReviewOwner,async function(req,res){
        Review.findById(req.params.id,async function(err, foundReview){
            if(err){
                console.log(err);
                res.redirect('/news/'+ req.params.id)
            } else{
                for await(let comment of foundReview.comments){
                    Comment.findByIdAndRemove(comment._id,function(err){
                        if(err){
                            console.log(err);
                        }
                    })
                }
                const imagePath = './public/uploads/review/' + foundReview.image;
                fs.unlink(imagePath, function(err){
                    if(err){
                        console.log(err);
                        res.redirect('/review');
                    }
                })
            }
        })
        await Review.findByIdAndRemove(req.params.id, function(err){
            if(err){
                console.log("error to delete news");
                res.redirect("/news");
            }
            res.redirect("/review");
        });
    })


module.exports = router;
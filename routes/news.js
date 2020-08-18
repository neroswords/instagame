const tag = require("../models/tag");

const express = require("express"),
    router = express.Router(),
    multer = require('multer'),
    path = require('path'),
    fs = require('fs'),
    passport = require('passport'),
    User = require('../models/user'),
    Community = require('../models/commu'),
    Team = require('../models/team'),
    News = require('../models/news'),
    Review = require('../models/review'),
    Tag = require('../models/tag'),
    Comment = require('../models/comment'),
    middleware = require('../middleware');

var moment = require('moment');     
const { populate } = require("../models/user");

const storage = multer.diskStorage({
    destination : './public/uploads/news',
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
        var category = " "
        News.find({}, function(error, allNews){
            if(error){
                console.log("Error!!");
                
            }else{
                res.render("all_news",{News : allNews, moment: moment, category : category});
            }
        }).sort({date : -1});
    })

    router.get("/category/:category", function(req,res){
        var n_type = req.params.category;
        Tag.find({name : n_type}, function(err, foundtag){
            if(err){
                console.log(err);
            } else {
                News.find({tags : {$in : foundtag}}, function(error, someNews){
                    if(error){
                        console.log(error);
                        
                     }else {
                        res.render("all_news",{News : someNews, moment: moment,category : req.params.category});
                    }
                }).sort({date : -1});
        }
    })
})


    router.get("/create", middleware.checkTu, function(req,res){
        res.render("c_news");
    })

    router.post("/create", middleware.checkTu, upload.single('image'), function(req,res){
        let n_head = req.body.headline;
        let n_content = req.body.content;
        let n_image = req.file.filename;
        let n_viewers = 1;
        let n_user_post = {id: req.user._id, alias: req.user.alias};
        var n_game = req.body.game;
        var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
        let n_date = new Date(asiaTime).toISOString();
        let n_post = {head:n_head, content:n_content, viewers : n_viewers, user_post:n_user_post, game:n_game, date: n_date, image : n_image};
        News.create(n_post, async function(error, newNews){
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
                            let n_tag = {name : tag , type : n_type_tag ,view :n_view}
                            Tag.create(n_tag,async function(error, newTag){
                                if(error){
                                    console.log(error);
                                } else {
                                    console.log("dont find");    
                                    newNews.tags.push(newTag._id);
        
                                }
                            })
                        } else {
                            findTag[0].view++;
                            findTag[0].save();
                            await newNews.tags.push(findTag[0]._id);
                        }    
                    }) 
                    
                }; 
                Tag.find({ name: n_game },async function(err,findGame){
                    if(err){
                        console.log(err);
                        
                    } else if(!findGame.length){
                        let game_tag = { name : n_game, type : n_type_game, view : n_view};
                        Tag.create(game_tag,async function(error, gameTag){
                            await newNews.tags.push(gameTag);
                            newNews.save();
                        })
                    } else if(findGame.length){
                        await newNews.tags.push(findGame[0]);
                        findGame[0].view++;
                        findGame[0].save();
                        newNews.save();
                    }
                })
                
            }
            res.redirect("/news/"+ newNews._id);
        })
    })

    

    router.get("/:id", function(req,res){
        News.findById(req.params.id).populate('comments').populate('tags').exec( function(error, idNews){
            if(error){
                console.log("ERROR");
                
            } else{
                    idNews.viewers++;
                    idNews.save();
                    var n_type_game = "game";
                    Tag.find({type : n_type_game}, function(err, hotGame){
                        Review.find({tags : {$in : hotGame }}, function(err,HOTGAME){
                            var n_hotgame = HOTGAME;
                            Tag.find({name : idNews.game}, function(err,foundTag){
                                News.find({tags : {$in : foundTag }}, function(err,foundrelateNews){
                                    var n_News = foundrelateNews;
                                        Community.find({tags : {$in : foundTag }}, function(err,foundrelateCommu){
                                            var n_Commu = foundrelateCommu;
                                                res.render("news",{news:idNews, 
                                                    moment: moment, 
                                                    reCommu : n_Commu,  
                                                    reNews : n_News, 
                                                    hotgames : n_hotgame});
                                        }).sort({date : -1}).limit(4);
                                    }).sort({date : -1}).limit(6);    
                                })
                            }).sort({view : -1}).limit(4);
                    })
                }
            }
        )
    })

    router.get("/:id/edit", middleware.checkNewsOwner, function(req,res){
        News.findById(req.params.id, function(err, foundNews){
            if(err){
                console.log(err);
                
            } else {
                res.render("edit_news", {news : foundNews})
            }
        })
    })

    router.put("/:id", middleware.checkNewsOwner, upload.single('image'), function(req, res){
        let n_head = req.body.head;
        let n_content = req.body.content;
        if(req.file){
            let n_image = req.file.filename;
            News.findById(req.params.id, function(err, foundNews){
                if(err){
                    console.log(err);
                    res.redirect('/news/'+ req.params.id)
                } else{
                    const imagePath = './public/uploads/news/' + foundNews.image;
                    fs.unlink(imagePath, function(err){
                        if(err){
                            console.log(err);
                            res.redirect('/news');
                        }
                    })
                }
            })
            var n_news = {head : n_head, image : n_image, content : n_content}
        } else {
            var n_news = {head : n_head, content : n_content}
        }
        News.findByIdAndUpdate(req.params.id, n_news, function(err, updateNews){
            if(err){
                console.log(err);
                
            } else {
                res.redirect('/news/' + req.params.id);
            }
        })
    })

    router.delete("/:id", middleware.checkNewsOwner,async function(req,res){
        News.findById(req.params.id, async function(err, foundNews){
            if(err){
                console.log(err);
                res.redirect('/news/'+ req.params.id)
            } else{
                for await(let comment of foundNews.comments){
                    Comment.findByIdAndRemove(comment._id,function(err){
                        if(err){
                            console.log(err);
                        }
                    })
                }
                const imagePath = './public/uploads/news/' + foundNews.image;
                fs.unlink(imagePath, function(err){
                    if(err){
                        console.log(err);
                    }
                })
            }
        })
        await News.findByIdAndRemove(req.params.id, function(err){
            if(err){
                console.log("error to delete news");
                res.redirect("/news");
            }
            req.flash('success', "success to delete news")
            res.redirect("/news");
        });
    })


module.exports = router;


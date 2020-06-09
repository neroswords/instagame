const express = require("express"),
    router = express.Router(),
    multer = require('multer'),
    path = require('path'),
    fs = require('fs'),
    passport = require('passport'),
    User = require('../models/user'),
    News = require('../models/news'),
    middleware = require('../middleware');

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
        News.find({}, function(error, allNews){
            if(error){
                console.log("Error!!");
                
            }else{
                res.render("all_news",{News : allNews});
            }
        })
    })

    router.get("/create", middleware.isLoggedIn, function(req,res){
        res.render("c_news");
    })

    router.post("/create", middleware.isLoggedIn, upload.single('image'), function(req,res){
        let n_head = req.body.headline;
        let n_content = req.body.content;
        let n_image = req.file.filename;
        let n_viewers = 1;
        let n_user_post = {id: req.user._id, alias: req.user.alias};
        let n_game = req.body.game;
        var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
        let n_date = new Date(asiaTime).toISOString();
        let n_post = {head:n_head, content:n_content, viewers : n_viewers, user_post:n_user_post, game:n_game, date: n_date, image : n_image};
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

    router.get("/:id/edit", middleware.checkNewsOwner, function(req,res){
        News.findById(req.params.id, function(err, foundNews){
            if(err){
                console.log(err);
                
            } else {
                foundNews.viewers++;
                res.render("edit_news", {news : foundNews})
            }
        })
    })

    router.put("/:id", middleware.checkNewsOwner, upload.single('image'), function(req, res){
        let n_head = req.body.head;
        let n_content = req.body.content;
        if(req.file){
            let n_image = req.file.filename;
            console.log(n_image);
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

    router.delete("/:id", middleware.checkNewsOwner, function(req,res){
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
        News.findByIdAndRemove(req.params.id, function(err){
            if(err){
                console.log("error to delete news");
                res.redirect("/news");
            }
            res.redirect("/news");
        });
    })


module.exports = router;


const express = require("express"),
    router = express.Router(),
    multer = require('multer'),
    path = require('path'),
    fs = require('fs'),
    passport = require('passport'),
    User = require('../models/user'),
    Communication = require('../models/commu'),
    Comment = require('../models/comment'),
    Team = require('../models/team'),
    News = require('../models/news'),
    Review = require('../models/review'),
    Tag = require('../models/tag'),
    middleware = require('../middleware');

    var moment = require('moment');

    const storage = multer.diskStorage({
        destination : './public/uploads/commu',
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
    Tag.find({name : "Survival"}, function(err,foundTag){
        Communication.find({tags : {$in : foundTag }}, function(err,foundSurvival){
            var n_Survival = foundSurvival;
            Tag.find({name : "RPG"}, function(err,foundTag){
                Communication.find({tags : {$in : foundTag }}, function(err,foundRPG){
                    var n_RPG = foundRPG;    
                    Tag.find({name : "Battle Royal"}, function(err,foundTag){
                        Communication.find({tags : {$in : foundTag }}, function(err,foundBattleR){
                            var n_Battle_Royal = foundBattleR;
                            Tag.find({name : "FPS"}, function(err,foundTag){
                                Communication.find({tags : {$in : foundTag }}, function(err,foundFPS){
                                    var n_FPS = foundFPS;
                                    Tag.find({name : "MOBA"}, function(err,foundTag){
                                        Communication.find({tags : {$in : foundTag }}, function(err,foundMOBA){
                                            var n_MOBA = foundMOBA;
                                            Tag.find({name : "Fighting"}, function(err,foundTag){
                                                Communication.find({tags : {$in : foundTag }}, function(err,foundFighting){
                                                    var n_Fighting = foundFighting;  
                                                    Tag.find({name : "Sports"}, function(err,foundTag){
                                                        Communication.find({tags : {$in : foundTag }}, function(err,foundSports){
                                                            var n_Sports = foundSports;
                                                            Tag.find({name : "Racing"}, function(err,foundTag){
                                                                Communication.find({tags : {$in : foundTag }}, function(err,foundRacing){
                                                                    var n_Racing = foundRacing;
                                                                    res.render("column_game_type", {Battle_Royal : n_Battle_Royal,
                                                                                        FPS : n_FPS,
                                                                                        Fighting : n_Fighting,
                                                                                        MOBA : n_MOBA,
                                                                                        RPG : n_RPG,
                                                                                        Racing : n_Racing,
                                                                                        Sports : n_Sports,
                                                                                        Survival : n_Survival, 
                                                                                        moment: moment});
                                                                }).sort({date : -1}).limit(2);
                                                            })    
                                                        }).sort({date : -1}).limit(2)
                                                    });
                                                }).sort({date : -1}).limit(2);
                                            })    
                                        }).sort({date : -1}).limit(2);
                                    })  
                                }).sort({date : -1}).limit(2);
                            })  
                        }).sort({date : -1}).limit(2);
                    })
                }).sort({date : -1}).limit(2);
            })           
        }).sort({date : -1}).limit(2);
    })
    // Communication.find({}, function(error,allCommu){
    //     if(error){
    //         console.log("Error to find commu database");
            
    //     }else{
    //         res.render("column", {Commu : allCommu, moment: moment});
    //     }
    // }).sort({date : -1})
});

router.get("/category", function(req,res){
    Communication.find({}, function(error, someCommu){
        if(error){
            console.log(error);        
        }else {
            res.render("column",{Commu : someCommu, moment: moment});
        }
    }).sort({date : -1});
})

router.get("/category/:category", function(req,res){
    var n_type = req.params.category;
    Tag.find({name : n_type}, function(err, foundtag){
        if(err){
            console.log(err);
        } else {
            Communication.find({tags : {$in : foundtag}}, function(error, someCommu){
                if(error){
                    console.log(error);
                    
                 }else {
                    res.render("column",{Commu : someCommu, moment: moment});
                }
            }).sort({date : -1});
        }
    })
})

router.get("/my_column",middleware.isLoggedIn, function(req,res){
    Communication.find({}, function(error, myCommu){
        if(error){
            console.log("Error!!");
            
        }else{
            res.render("my_column",{Commu : myCommu, moment: moment});
        }
    }).sort({date : -1})
})

router.get("/create", middleware.isLoggedIn, function(req,res){
    res.render("c_column");
});

router.get("/type", function(req,res){
    res.render("column_game_type");
});

router.get("/type/all", function(req,res){
    res.render("column_game_type_all");
});


router.post("/create", middleware.isLoggedIn, upload.single('image'), function(req,res){
    let n_head = req.body.head;
    let n_content = req.body.content;
    let n_user_post = {id: req.user._id, alias: req.user.alias};
    let n_image = req.file.filename;
    let n_game = req.body.game;
    let n_viewers = 1;
    var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
    let n_date = new Date(asiaTime).toISOString();
    let n_post = {head:n_head, content:n_content, user_post:n_user_post, game:n_game, date: n_date, image : n_image , viewers : n_viewers};
    Communication.create(n_post, async function(error, newCommu){
        if(error){
            console.log("error create commu");
        }
        else{
            var n_type_tag = "tag";
            var n_type_game = "game";
            var n_view = 1;
            var tagsarr = req.body.tags[0].split(',');
            await tagsarr.push(req.body.type);
            
                for await (let tag of tagsarr) {
                    await Tag.find({ name : tag },async function(err, findTag){
                        if(err){
                            console.log(err);
                        } else if(!findTag.length){
                            let n_tag = {name : tag, type : n_type_tag ,view :n_view}
                            Tag.create(n_tag,async function(error, newTag){
                                if(error){
                                    console.log(error);
                                } else {
                                    console.log("dont find");    
                                    newCommu.tags.push(newTag);
                                }
                            })
                        } else {
                            findTag[0].view++;
                            findTag[0].save();
                            newCommu.tags.push(findTag[0]._id);
                        }    
                    }) 
                    
                }; 
                await Tag.find({ name: n_game },async function(err,findGame){
                    if(err){
                        console.log(err);
                        
                    } else if(!findGame.length){
                        let game_tag = { name : n_game, type : n_type_game, view : n_view};
                        Tag.create(game_tag,async function(error, gameTag){
                            newCommu.tags.push(gameTag);
                            await newCommu.save();
                        })
                    } else if(findGame.length){
                        findGame[0].view++;
                        findGame[0].save();
                        newCommu.tags.push(findGame[0]);
                        await newCommu.save();
                    }
                })
            await res.redirect("/commu");
        }
    })
})

router.get("/:id", function(req,res){
    Communication.findById(req.params.id).populate('comments').populate('tags').exec( function(error, idCommu){
        if(error){
            console.log("ERROR");
            
        } else{
            idCommu.viewers++;
            idCommu.save();
            var n_type_game = "game";
            Tag.find({type : n_type_game}, function(err, hotGame){
                Review.find({tags : {$in : hotGame }}, function(err,HOTGAME){
                    var n_hotgame = HOTGAME;
                    Tag.find({name : idCommu.game}, function(err,foundTag){
                        News.find({tags : {$in : foundTag }}, function(err,foundrelateNews){
                            var n_News = foundrelateNews;
                            Team.find({tags : {$in : foundTag }}, function(err,foundrelateTeam){
                                var n_Team = foundrelateTeam;
                                Communication.find({tags : {$in : foundTag }}, function(err,foundrelateCommu){
                                    var n_Commu = foundrelateCommu;
                                        res.render("column_detail",{commu:idCommu, 
                                            moment: moment, 
                                            reCommu : n_Commu, 
                                            reTeam : n_Team, 
                                            reNews : n_News, 
                                            hotgames : n_hotgame});
    
                                }).sort({date : -1}).limit(6);
                            }).sort({date : -1}).limit(2);    
                        }).sort({date : -1}).limit(2);
                    })  
                })
            }).sort({view : -1}).limit(4);
            }
        }
    )}
)

router.get("/:id/edit", middleware.checkCommuOwner, function(req,res){
    Communication.findById(req.params.id, function(err, foundCommu){
        if(err){
            console.log(err);
            
        } else {
            res.render("edit_column", {Commu : foundCommu})
        }
    })
})

router.put("/:id", middleware.checkCommuOwner, upload.single('image'), function(req, res){
    let n_head = req.body.head;
    let n_content = req.body.content;
    if(req.file){
        let n_image = req.file.filename;
        console.log(n_image);
        Communication.findById(req.params.id, function(err, foundCommu){
            if(err){
                console.log(err);
                res.redirect('/commu/'+ req.params.id)
            } else{
                const imagePath = './public/uploads/commu/' + foundCommu.image;
                fs.unlink(imagePath, function(err){
                    if(err){
                        console.log(err);
                        res.redirect('/commu');
                    }
                })
            }
        })
        var n_commu = {head : n_head, image : n_image, content : n_content}
    } else {
        var n_commu = {head : n_head, content : n_content}
    }
    Communication.findByIdAndUpdate(req.params.id, n_commu, function(err, updateCommu){
        if(err){
            console.log(err);
            
        } else {
            res.redirect('/commu/' + req.params.id);
        }
    })
})

router.delete("/:id", middleware.checkCommuOwner,async function(req,res){
    Communication.findById(req.params.id,async function(err, foundCommu){
        if(err){
            console.log(err);
            res.redirect('/commu/'+ req.params.id)
        } else{
            for await(let comment of foundCommu.comments){
                Comment.findByIdAndRemove(comment._id,function(err){
                    if(err){
                        console.log(err);
                    }
                })
            }
            const imagePath = './public/uploads/commu/' + foundCommu.image;
            fs.unlink(imagePath, function(err){
                if(err){
                    console.log(err);
                    res.redirect('/commu');
                }
            })
        }
    })
    await Communication.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("error to delete commu");
            res.redirect("/commu");
        }
        res.redirect("/commu");
    });
})


module.exports = router;

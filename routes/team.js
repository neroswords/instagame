const express = require("express"),
    router = express.Router(),
    multer = require('multer'),
    path = require('path'),
    fs = require('fs'),
    passport = require('passport'),
    User = require('../models/user'),
    Team = require('../models/team'),
    Party = require('../models/party'),
    Comment = require('../models/comment'),
    Tag = require('../models/tag'),
    middleware = require('../middleware'),
    async = require('async');

    var moment = require('moment'); 

    const storage = multer.diskStorage({
        destination : './public/uploads/team',
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
    Team.find({}, function(error, allTeam){
        if(error){
            console.log("Error!!");
            
        }else{
            res.render("team",{Team : allTeam, moment: moment});
        }
    }).sort({date : -1})
})

router.get("/category/:category", function(req,res){
    var n_type = req.params.category;
    Tag.find({name : n_type}, function(err, foundtag){
        if(err){
            console.log(err);
        } else {
            Team.find({tags : {$in : foundtag}}, function(error, someTeam){
                if(error){
                    console.log(error);
                    
                 }else { 
                    res.render("team",{Team : someTeam, moment: moment});
                }
            }).sort({date : -1});
        }
    })
})

router.get("/my_team",middleware.isLoggedIn, function(req,res){
    Team.find({}, function(error, allTeam){
        if(error){
            console.log("Error!!");
            
        }else{
            res.render("my_team",{Team : allTeam, moment: moment});
        }
    }).sort({date : -1})
})

router.get("/create", middleware.isLoggedIn, function(req,res){
    res.render("c_team");
});

router.post("/create", middleware.isLoggedIn, upload.single('image'), function(req,res){
    let n_head = req.body.headline;
    let n_content = req.body.content;
    let n_user_post = {id: req.user._id, alias: req.user.alias};
    let n_game = req.body.game;
    let n_number = 1;
    let n_max_number = req.body.max_number;
    let n_appointment_date = req.body.appointment_date;
    let n_appointment_time = req.body.appointment_time;
    var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
    let n_date = new Date(asiaTime).toISOString();
    if(req.file){
        let n_image = req.file.filename;
        var n_post = {head:n_head, 
            content:n_content,
            user_post:n_user_post,
            game:n_game,
            date_post: n_date,
            appointment_date:n_appointment_date,
            appointment_time:n_appointment_time,
            number : n_number,
            maxplayer : n_max_number,
            image : n_image
        };
    } else {
        let n_image = "none.jpg";
        var n_post = {head:n_head, 
            content:n_content,
            user_post:n_user_post,
            game:n_game,
            date_post: n_date,
            appointment_date:n_appointment_date,
            appointment_time:n_appointment_time,
            number : n_number,
            maxplayer : n_max_number,
            image : n_image
        }
    }
    Team.create(n_post,async function(error, newTeam){
        if(error){
            console.log("error create team");
        }
        else{
            var n_type_tag = "tag";
            var n_type_game = "game";
            var n_view = 1;
            newTeam.party.push(req.user);
            var tagsarr = req.body.tags.split(',');
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
                                newTeam.tags.push(newTag);

                            }
                        })
                    } else {
                        findTag[0].view++;
                        findTag[0].save();
                        await newTeam.tags.push(findTag[0]._id);
                    }    
                }) 
                
            }; 
            await Tag.find({ name: n_game },async function(err,findGame){
                if(err){
                    console.log(err);
                    
                } else if(!findGame.length){
                    let game_tag = { name : n_game, type : n_type_game, view : n_view};
                    Tag.create(game_tag,async function(error, gameTag){
                        await newTeam.tags.push(gameTag);
                        newTeam.save();
                        res.redirect("/team/" + newTeam._id)
                    })
                } else if(findGame.length){
                    await newTeam.tags.push(findGame[0]);
                    findGame[0].view++;
                    findGame[0].save();
                    newTeam.save();
                    res.redirect("/team/" + newTeam._id)
                }
            })
            // Party.create(,function(err,newParty){
            //     if(err){
            //         console.log("error to create party list");
                    
            //     }
            //     else{
            //         newTeam.party.push(Party);
            //         newTeam.save();
            //         console.log(newTeam);
                    
            //         res.redirect("/team/" + newTeam._id)
            //     }
            // })
        }
    })
})

router.get("/:id", function(req,res){
    Team.findById(req.params.id).populate('comments').populate('party').populate('tags').exec(function(error, idTeam){
        if(error){
            console.log("ERROR");
            
        } else{
            res.render("team_detail",{team:idTeam, moment: moment});
            }
        }
    )}
)

router.delete("/:id", middleware.checkTeamOwner,async function(req,res){
    Team.findById(req.params.id,async function(err, foundTeam){
        if(err){
            console.log(err);
            res.redirect('/team/'+ req.params.id)
        } else{
            for await(let comment of foundTeam.comments){
                Comment.findByIdAndRemove(comment._id,function(err){
                    if(err){
                        console.log(err);
                    }
                })
            }
            const imagePath = './public/uploads/team/' + foundTeam.image;
            fs.unlink(imagePath, function(err){
                if(err){
                    console.log(err);
                    res.redirect('/team');
                }
            })
        }
    })
    await Team.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("error to delete team");
            res.redirect("/team/"+ req.params.id);
        }
        res.redirect("/team");
    });
})

router.post("/:id/addlist",middleware.isLoggedIn, function(req,res){
    Team.findById(req.params.id, function(err, idTeam){
        if(err){
            console.log("cannot find team");
            res.redirect("/team")
        }
        else{
            idTeam.number++;
            if(idTeam.maxplayer >= idTeam.number){
                for(let n = 0; n < idTeam.number; n++){
                    if(req.user._id.equals(idTeam.party[n])){
                        return res.redirect("/team");
                    }
                }
                idTeam.party.push(req.user);
                idTeam.save();
                console.log(idTeam); 
                res.redirect("back")
            }
            else{
                req.flash('error','Party is already full.');
                res.redirect("back")
            }
            // Party.findById(idTeam.party._id, function(err, idParty){
            //     if(err){
            //         console.log("cannot find Party");
            //         res.redirect("/team")
            //     }else{
            //         let n_number = idTeam.number++;
            //         idParty.posts.push(member);
            //         foundUser.save(function(err, data){
            //             if(err){
            //                 console.log(err);
            //             } else {
            //                 console.log(data);
            //             }
            //         });
            //     }
            // })
        }
    })
})

router.post("/:id/deletelist",middleware.isLoggedIn, function(req,res){
    Team.findById(req.params.id, function(err, idTeam){
        if(err){
            console.log("cannot find team");
            res.redirect("/team")
        }
        else{
            if(!req.user._id.equals(idTeam.user_post.id)){
                for(let n = 0; n < idTeam.number; n++){                  
                    if(req.user._id.equals(idTeam.party[n])){ 
                        idTeam.party.splice(n, 1);
                        idTeam.number--;
                        idTeam.save();
                        return res.redirect("/team");
                    }
                }
            }
            else {
                req.flash('error','Cannot out from party please delete the party instead');
                res.redirect("back")
            }
            // Party.findById(idTeam.party._id, function(err, idParty){
            //     if(err){
            //         console.log("cannot find Party");
            //         res.redirect("/team")
            //     }else{
            //         let n_number = idTeam.number++;
            //         idParty.posts.push(member);
            //         foundUser.save(function(err, data){
            //             if(err){
            //                 console.log(err);
            //             } else {
            //                 console.log(data);
            //             }
            //         });
            //     }
            // })
        }
    })
})



module.exports = router;
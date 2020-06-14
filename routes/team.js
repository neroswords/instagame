const express = require("express"),
    router = express.Router(),
    multer = require('multer'),
    path = require('path'),
    fs = require('fs'),
    passport = require('passport'),
    User = require('../models/user'),
    Team = require('../models/team'),
    Party = require('../models/party'),
    middleware = require('../middleware');

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
    })
})

router.get("/my_team",middleware.isLoggedIn, function(req,res){
    Team.find({}, function(error, allTeam){
        if(error){
            console.log("Error!!");
            
        }else{
            res.render("my_team",{Team : allTeam, moment: moment});
        }
    })
})

router.get("/create", middleware.isLoggedIn, function(req,res){
    res.render("c_team");
});

router.post("/create", middleware.isLoggedIn, upload.single('image'), function(req,res){
    let n_head = req.body.headline;
    let n_content = req.body.content;
    let n_user_post = {id: req.user._id, alias: req.user.alias};
    let n_game = req.body.game;
    let n_image = req.file.filename;
    let n_number = 1;
    let n_max_number = req.body.max_number;
    let n_appointment_date = req.body.appointment_date;
    let n_appointment_time = req.body.appointment_time;
    var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
    let n_date = new Date(asiaTime).toISOString();
    let n_post = {head:n_head, 
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
    Team.create(n_post, function(error, newTeam){
        if(error){
            console.log("error create team");
        }
        else{
            newTeam.party.push(req.user);
            newTeam.save();
            res.redirect("/team/" + newTeam._id)
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
    Team.findById(req.params.id).populate('comments').populate('party').exec(function(error, idTeam){
        if(error){
            console.log("ERROR");
            
        } else{
            res.render("team_detail",{team:idTeam, moment: moment});
            }
        }
    )}
)

router.delete("/:id", middleware.checkTeamOwner, function(req,res){
    Team.findById(req.params.id, function(err, foundTeam){
        if(err){
            console.log(err);
            res.redirect('/team/'+ req.params.id)
        } else{
            const imagePath = './public/uploads/team/' + foundTeam.image;
            fs.unlink(imagePath, function(err){
                if(err){
                    console.log(err);
                    res.redirect('/team');
                }
            })
        }
    })
    Team.findByIdAndRemove(req.params.id, function(err){
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



module.exports = router;
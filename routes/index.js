const { query } = require("express");
const tag = require("../models/tag");
const news = require("../models/news");

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
    List = require('../models/list'),
    middleware = require('../middleware');

    var moment = require('moment');
const { isLoggedIn } = require("../middleware");

    const storage = multer.diskStorage({
        destination : './public/uploads/user',
        filename : function(req, file, cb){
            cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    });
    
    const imageFilter = function(req, file, cb){
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.gif' && ext !== '.pdf'){
            return cb(new Error('Only image is allow to upload'),false)
        }
        cb(null, true);
    }
    
    const upload = multer({storage : storage, fileFilter : imageFilter});


router.get("/", function(req,res){
    Tag.find({name : "Survival"}, function(err,foundTag){
        News.find({tags : {$in : foundTag }}, function(err,foundSurvival){
            var n_Survival = foundSurvival;
            Tag.find({name : "RPG"}, function(err,foundTag){
                News.find({tags : {$in : foundTag }}, function(err,foundRPG){
                    var n_RPG = foundRPG;    
                    Tag.find({name : "Battle Royal"}, function(err,foundTag){
                        News.find({tags : {$in : foundTag }}, function(err,foundBattleR){
                            var n_Battle_Royal = foundBattleR;
                            Tag.find({name : "FPS"}, function(err,foundTag){
                                News.find({tags : {$in : foundTag }}, function(err,foundFPS){
                                    var n_FPS = foundFPS;
                                    Tag.find({name : "MOBA"}, function(err,foundTag){
                                        News.find({tags : {$in : foundTag }}, function(err,foundMOBA){
                                            var n_MOBA = foundMOBA;
                                            Tag.find({name : "Fighting"}, function(err,foundTag){
                                                News.find({tags : {$in : foundTag }}, function(err,foundFighting){
                                                    var n_Fighting = foundFighting;  
                                                    Tag.find({name : "Sports"}, function(err,foundTag){
                                                        News.find({tags : {$in : foundTag }}, function(err,foundSports){
                                                            var n_Sports = foundSports;
                                                            Tag.find({name : "Racing"}, function(err,foundTag){
                                                                News.find({tags : {$in : foundTag }}, function(err,foundRacing){
                                                                    var n_Racing = foundRacing;
                                                                    Team.find({}, function(err,foundTeam){
                                                                        var n_Team = foundTeam;
                                                                        Community.find({}, function(err,foundCommu){
                                                                            var n_Commu = foundCommu;
                                                                            Review.find({}, function(err,foundReview){
                                                                                var n_Review = foundReview;
                                                                                res.render("home",
                                                                                {   Battle_Royal : n_Battle_Royal, 
                                                                                    FPS : n_FPS,
                                                                                    Fighting : n_Fighting,
                                                                                    MOBA : n_MOBA,
                                                                                    RPG : n_RPG,
                                                                                    Racing : n_Racing,
                                                                                    Sports : n_Sports,
                                                                                    Survival : n_Survival,
                                                                                    Team : n_Team,
                                                                                    Commu : n_Commu,
                                                                                    Review : n_Review,
                                                                                    moment: moment});
                                                                            }).sort({date : -1}).limit(8);
                                                                        }).sort({date : -1}).limit(8);
                                                                    }).sort({date : -1}).limit(8);    
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
});

router.get("/profile/:id", function(req,res){
    User.findById(req.params.id, function(err,foundProfile){
        News.find({}, function(err,foundNews){
            Team.find({},function(err,foundTeam){
                Community.find({},function(err,foundCommu){
                    Review.find({},function(err,foundReview){
                        res.render("profile", {user: foundProfile, 
                            News : foundNews,
                            Commu : foundCommu,
                            Team : foundTeam,
                            Review : foundReview,
                            moment : moment
                        });
                    }) 
                })
            }) 
        })
    })
})

router.get("/promotion", middleware.checkO, function(req,res){
    List.find({}).populate('list').exec( function(err,allList){
        res.render("promotion",{List : allList});
    })
})

router.get("/promotion/request/:id", middleware.isLoggedIn, function(req,res){
    res.render("promotion_create");
})

//รับidของ userที่ขอมา
router.post("/promotion/request/:id",middleware.isLoggedIn,upload.single('PDF'), function(req,res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err); 
        } else {
            foundUser.status = "sent";
            foundUser.save();
            var n_content = req.body.content;
            var n_company = req.body.company;
            let n_file = req.file.filename
            var n_list = {list : foundUser,
                content : n_content, 
                company : n_company,
                doc : n_file}
            List.create(n_list, function(err,newList){
                req.flash('sucess',"you already sent request")
                res.redirect("/profile/"+req.params.id)
            })
        }
    })
})

// ส่ง id ของ listมาหาก่อน
router.post("/promotion/success/:id", middleware.checkO,function(req,res){
    List.findById(req.params.id, function(err, foundList){
        User.findById(foundList.list, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                foundUser.class = "Noble";
                foundUser.save();
                List.findByIdAndRemove(req.params.id, function(err){
                    if(err){
                        console.log(err);
                    }
                })
                req.flash('success','New One has became the Noble')
                res.redirect("/promotion");
            }
        })
    })
})

// router.post("/promotion/demote/:id", middleware.checkO,function(req,res){
//     List.findById(req.params.id, function(err, foundList){
//         User.findById(foundList.list, function(err, foundUser){
//             if(err){
//                 console.log(err);
//             } else {
//                 foundUser.class = "People";
//                 foundUser.status = "none";
//                 foundUser.save();
//                 List.findByIdAndRemove(req.params.id, function(err){
//                     if(err){
//                         console.log(err);
//                     }
//                 })
//                 res.redirect("/promotion");
//             }
//         })
//     })
// })

router.delete("/promotion/denied/:id", middleware.checkO,function(req,res){
    List.findById(req.params.id, function(err, foundList){
        User.findById(foundList.list, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                foundUser.status = "none";
                foundUser.save();
                List.findByIdAndRemove(req.params.id, function(err){
                    if(err){
                        console.log(err);
                    }
                })
                req.flash('error','Not THAT ONE')
                res.redirect("/promotion");
            }
        })
    })
})

    

    

router.get("/profile/editProfile", middleware.isLoggedIn, function(req,res){
    res.render("Edit_profile");
});

router.get("/profile/changePassword", function(req,res){
    res.render("changePassword");
});

router.get("/login", function(req,res){
    res.render("login");
});
    
router.post('/login', passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/login'
    }),function(req, res){
});

router.get('/logout', function(req,res){
    req.logout();
    req.flash('success','You log out successfully');
    res.redirect('back');
});

router.get('/profile/:id', middleware.isLoggedIn, function(req,res){
    User.findById(req.params.id, function(err, foundProfile){
        res.render("profile", { user : foundProfile});
    })
    
})


router.get('/editProfile/:id', middleware.isLoggedIn , function(req,res){
    User.findById(req.params.id, function(err, foundProfile){
        if(err){
            console.log("error to find profile");
            
        }else{  
            res.render("Edit_profile", {user: foundProfile});
        }
    })
})

router.put("/editProfile/:id", middleware.isLoggedIn, upload.single('image'), function(req,res){
    let n_alias = req.body.alias;
    let n_firstname = req.body.firstname;
    let n_lastname = req.body.surname;
    let n_email = req.body.email;
    let n_number = req.body.tel;
    if(req.file){
        let n_image = req.file.filename;
        User.findById(req.params.id, function(err, foundUser){
            if(err){
                console.log(err);
                res.redirect('/')
            } else{
                const imagePath = './public/uploads/user/' + foundUser.image;
                fs.unlink(imagePath, function(err){
                    if(err){
                        console.log(err);
                        res.redirect('/');
                    }
                })
            }
        })
        var n_user = {firstname : n_firstname,
                        lastname : n_lastname,
                        image : n_image,
                        alias : n_alias,
                        email : n_email,
                        number : n_number}
    } else {
        var n_user = {firstname : n_firstname,
            lastname : n_lastname,
            alias : n_alias,
            email : n_email,
            number : n_number}
    }
    User.findByIdAndUpdate(req.params.id, n_user, function(err, updateUser){
        if(err){
            console.log("error updating profile");
            res.redirect("/");
        }else{
            res.redirect("/profile/"+req.params.id);
        }
    })
})

// router.post('/editProfile', middleware.isLoggedIn, function(req, res, next){
//     User.findById(req.user.id, function (err, user) {
//          if (!user) {
//             req.flash('error', 'No account found');
//             return res.redirect('/edit');
//         }

//         var email = req.body.email.trim();
//         var name = req.body.username.trim();
//         var firstname = req.body.firstname.trim();
//         var lastname = req.body.lastname.trim();
//         var number = req.body.number;
//         var birth_day = req.body.birth_day;


//         if (!email || !username || !firstname || !lastname || !number || !birth_day) { 
//             req.flash('error', 'One or more fields are empty');
//             return res.redirect('/edit'); 
//         }

//         user.email = email;
//         user.name = name;
//         user.firstname = firstname;
//         user.lastname = lastname;
//         user.number = number;
//         user.birth_day = birth_day;

//         user.save(function (err) {
//             if(err){
//                 console.log("error to save profile");
//                 req.flash("error", "error to save profile");
//                 return false;
//             }

//             res.redirect('/profile');
//         });
//     });
// });

  
router.get("/Sign_up", function(req,res){
    res.render("SignUp");
});
    
router.get("/Sign_up/acception", function(req,res){
    res.render("acception");
});

router.post('/Sign_up', upload.single('image'), function(req,res){
    let n_image = req.file.filename;
    let n_class = "People";
    let n_status = "none";
    User.register(new User({username: req.body.username, 
                            email: req.body.email , 
                            alias : req.body.alias,
                            image : n_image,
                            class : n_class,
                            firstname : req.body.firstname,
                            lastname : req.body.lastname,
                            status : n_status,
                            gender : req.body.gender,
                            birth_day : req.body.birth_day,
                            number : req.body.number}), req.body.password, 
                            function(err, user){
        if(err){
            console.log(err);
            return res.render('SignUp');
        }
        passport.authenticate('local')(req,res,function(){
            
            req.flash('success','Welcome to Instagame, ' + user.alias);
            res.redirect('/');
        });
    });
});

router.get("/login/forgetpsswd", function(req,res){
   res.render("forget_psw");
});




module.exports = router;
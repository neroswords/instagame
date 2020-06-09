const express = require("express"),
    router = express.Router(),
    multer = require('multer'),
    path = require('path'),
    fs = require('fs'),
    passport = require('passport'),
    User = require('../models/user'),
    middleware = require('../middleware');

    const storage = multer.diskStorage({
        destination : './public/uploads/user',
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
    res.render("home");
});

router.get("/profile", function(req,res){
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

router.get('/profile', middleware.isLoggedIn, function(req,res){
    res.render("profile")
})

router.get("/search", function(req,res){
    res.render("result");
});

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
    let n_lastname = req.body.lastname;
    let n_email = req.body.email;
    let n_number = req.body.number;
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
            res.redirect("/");
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
    User.register(new User({username: req.body.username, 
                            email: req.body.email , 
                            alias : req.body.alias,
                            image : n_image,
                            firstname : req.body.firstname,
                            lastname : req.body.surname,
                            gender : req.body.gender,
                            birth_day : req.body.birth_day,
                            number : req.body.tel}), req.body.password, 
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
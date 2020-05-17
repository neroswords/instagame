const express = require("express"),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');


router.get("/", function(req,res){
    res.render("home");
});

router.get("/profile", function(req,res){
    res.render("Edit_profile");
});

router.get("/profile/changePassword", function(req,res){
    res.render("changePassword");
});

router.get("/all-news", function(req,res){
    res.render("all_news");
});

router.get("/login", function(req,res){
    res.render("login");
});
    
router.post('/login', passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/login'
    }),function(req, res){
});

// router.post('/login', passport.authenticate("local", 
//     {
//         successRedirect: "/",
//         failureRedirect: "/login",
//         successFlash: true,            
//         failureFlash: true,
//         successFlash: 'Succesful!',
//         failureFlash: 'Invalid username or passwerd.'
//     })
// );

router.get('/logout', function(req,res){
    req.logout();
    req.flash('success','You log out successfully');
    res.redirect('/');
});

  
router.get("/Sign_up", function(req,res){
    res.render("SignUp");
});
    
router.get("/Sign_up/acception", function(req,res){
    res.render("acception");
});

router.post('/Sign_up', function(req,res){
    User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('SignUp');
        }
        passport.authenticate('local')(req,res,function(){
            
            req.flash('success','Welcome to Instagame, ' + user.username);
            res.redirect('/');
        });
    });
});

router.get("/login/forgetpsswd", function(req,res){
   res.render("forget_psw");
});

module.exports = router;
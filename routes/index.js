const express = require("express"),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');


router.get("/", function(req,res){
    res.render("landing");
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
            // req.flash('success','Welcome to Instagame, ' + user.username);
            res.redirect('/login');
        });
    });
});

router.get("/login", function(req,res){
    res.render("login");
});
    
router.post('/login', passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: 'login'
    }),function(req, res){
});

router.get("/login/forgetpsswd", function(req,res){
   res.render("forget_psw");
});

module.exports = router;
const express = require("express"),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');


router.get("/", function(req,res){
    res.render("home");
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
    res.redirect('/');
});

router.get('/profile', isLoggedIn, function(req,res){
    res.render("profile")
})

router.post('/editProfile', isLoggedIn, function(req, res, next){
    User.findById(req.user.id, function (err, user) {
         if (!user) {
            req.flash('error', 'No account found');
            return res.redirect('/edit');
        }

        var email = req.body.email.trim();
        var name = req.body.username.trim();
        var firstname = req.body.firstname.trim();
        var lastname = req.body.lastname.trim();
        var number = req.body.number;
        var birth_day = req.body.birth_day;


        if (!email || !username || !firstname || !lastname || !number || !birth_day) { 
            req.flash('error', 'One or more fields are empty');
            return res.redirect('/edit'); 
        }

        user.email = email;
        user.name = name;
        user.firstname = firstname;
        user.lastname = lastname;
        user.number = number;
        user.birth_day = birth_day;

        user.save(function (err) {
            if(err){
                console.log("error to save profile");
                req.flash("error", "error to save profile");
                return false;
            }

            res.redirect('/profile');
        });
    });
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
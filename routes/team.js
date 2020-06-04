const express = require("express"),
    router = express.Router()
    passport = require('passport'),
    User = require('../models/user'),
    Team = require('../models/team'),
    Party = require('../models/party'),
    middleware = require('../middleware');


router.get("/", function(req,res){
    res.render("team");
});

router.get("/create", function(req,res){
    res.render("c_team");
});

router.get("/my_team", function(req,res){
    res.render("my_team");
});

router.get("/detail", function(req,res){
    res.render("team_detail");
});

router.post("/create", middleware.isLoggedIn, function(req,res){
    let n_head = req.body.headline;
    let n_content = req.body.content;
    let n_user_post = {id: req.user._id, alias: req.user.alias};
    let n_game = req.body.game;
    var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
    let n_date = new Date(asiaTime).toISOString();
    let n_post = {head:n_head, content:n_content, user_post:n_user_post, game:n_game, date: n_date};
    Team.create(n_post, function(error, newTeam){
        if(error){
            console.log("error create team");
        }
        else{
            console.log(newTeam);
            res.redirect("/team");
        }
    })
})

router.get("/:id", function(req,res){
    Team.findById(req.params.id, function(error, idTeam){
        if(error){
            console.log("ERROR");
            
        } else{
            res.render("team",{team:idTeam});
            }
        }
    )}
)

router.delete("/:id", middleware.checkOwner, function(req,res){
    Team.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("error to delete team");
            res.redirect("/team");
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
            Party.findById(idTeam.party.id, function(err, idParty){
                if(err){
                    console.log("cannot find team");
                    res.redirect("/team")
                }else{
                    let n_id = req.user.id;
                    let n_name = req.user.alias;
                    let n_number = idParty.number++;
                    let member = {list:{id:n_id, alias:n_name},number:n_number}
                    idParty.posts.push(member);
                    foundUser.save(function(err, data){
                        if(err){
                            console.log(err);
                        } else {
                            console.log(data);
                        }
                    });
                }
            })
        }
    })
})


module.exports = router;
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
    middleware = require('../middleware');

    var moment = require('moment'); 

    router.get("/result", function(req, res){
        if(req.query.search){
            var n_result = req.query.search;
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            Tag.find({name : regex}, function(err, foundtag){
                if(err){
                    console.log(err);
                } else {
                    for(let tag of foundtag){
                    tag.view++;
                    tag.save();
                    }
                    Team.find({tags : {$in : foundtag}},function(err,foundTeam){
                        Review.find({tags : {$in : foundtag}},function(err,foundReview){
                            Community.find({tags : {$in : foundtag}},function(err,foundCommu){
                                News.find({tags : {$in : foundtag}},function(err,foundNews){
                                    res.render("result",{Team : foundTeam, Review : foundReview, Commu : foundCommu, News : foundNews, result : n_result});
                                }).sort({date : -1}).limit(4);  
                            }).sort({date : -1}).limit(4);
                        }).sort({date : -1}).limit(4);
                    }).sort({date : -1}).limit(4);                
                }
            })
        }
    })

    router.get("/", function(req, res, next){
        var q = req.query.q;
    
        Tag.find({ name : {
            $regex: new RegExp(q)
            }
        }, {
            _id:0,
            __v : 0
        }, function(err, data){
            res.json(data);
        }).limit(10);
    });

    router.get("/:keyword", function(req,res){
        if(req.params.keyword){
            var n_result = req.params.keyword;
            const regex = new RegExp(escapeRegex(req.params.keyword), 'gi');
            Tag.find({name : regex}, function(err, foundtag){
                if(err){
                    console.log(err);
                } else { 
                    foundtag[0].view++;
                    foundtag[0].save();
                    Team.find({tags : {$in : foundtag}},function(err,foundTeam){
                        Review.find({tags : {$in : foundtag}},function(err,foundReview){
                            Community.find({tags : {$in : foundtag}},function(err,foundCommu){
                                News.find({tags : {$in : foundtag}},function(err,foundNews){
                                    res.render("result",{moment : moment, Team : foundTeam, Review : foundReview, Commu : foundCommu, News : foundNews, result : n_result});
                                }).sort({date : -1}).limit(4); 
                            }).sort({date : -1}).limit(4);
                        }).sort({date : -1}).limit(4);
                    }).sort({date : -1}).limit(4);                
                }
            })
        }
    });

    router.get("/:keyword/:category", function(req,res){
        var n_result = req.params.keyword;
        const regex = new RegExp(escapeRegex(req.params.keyword), 'gi');
        Tag.find({name : regex }, function(err, foundtag){
            if(req.params.category === "news"){
                News.find({tags : {$in : foundtag}},function(err,foundNews){
                    res.render("category_result",{Result: foundNews, keyword :req.params.keyword, category:req.params.category, moment:moment});
                })
            }
            else if(req.params.category === "commu"){
                Community.find({tags : {$in : foundtag}},function(err,foundCommu){
                    res.render("category_result",{Result: foundCommu, keyword :req.params.keyword, category:req.params.category, moment:moment});
                })
            }
            else if(req.params.category === "review"){
                Review.find({tags : {$in : foundtag}},function(err,foundReview){
                    res.render("category_result",{Result: foundReview, keyword :req.params.keyword, category:req.params.category, moment:moment});
                })
            }
            else if(req.params.category === "team"){
                Team.find({tags : {$in : foundtag}},function(err,foundTeam){
                    res.render("category_result",{Result : foundTeam, keyword :req.params.keyword, category:req.params.category, moment:moment});
                })
            }
        })
    })

    


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
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

    router.get("/", function(req,res){
        if(req.query.search){
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            Tag.find({name : regex}, function(err, foundtag){
                if(err){
                    console.log(err);
                } else {
                    Team.find({tags : {$in : foundtag}},function(err,foundTeam){
                        Review.find({tags : {$in : foundtag}},function(err,foundReview){
                            Community.find({tags : {$in : foundtag}},function(err,foundCommu){
                                News.find({tags : {$in : foundtag}},function(err,foundNews){
                                    // console.log(foundTeam);
                                    // console.log(foundCommu);
                                    // console.log(foundNews);
                                    // console.log(foundReview);
                                    res.render("result",{Team : foundTeam, Review : foundReview, Commu : foundCommu, News : foundNews});
                                })  
                            })
                        })
                    })                
                }
            })
        }
    });

    router.get("/:category", function(req,req){
        if(req.params.category === "news"){

        }
        if(req.params.category === "commu"){
            
        }
        if(req.params.category === "review"){
            
        }
        if(req.params.category === "team"){
            
        }
    })




function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
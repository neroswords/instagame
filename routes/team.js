const express = require("express"),
    router = express.Router();


router.get("/", function(req,res){
    res.render("team");
});

router.get("/create", function(req,res){
    res.render("c_team");
});

module.exports = router;
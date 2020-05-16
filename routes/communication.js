const express = require("express"),
    router = express.Router();

router.get("/", function(req,res){
    res.render("column");
});

router.get("/create", function(req,res){
    res.render("c_column");
});

module.exports = router;

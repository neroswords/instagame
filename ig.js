const express = require("express");
let app = express();
const path = require("path");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportLocal = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const flash = require('connect-flash');
const methodOverride = require('method-override');
var async = require('async');

const User = require("./models/user"),
    Team = require("./models/team"),
    News = require("./models/news"),
    Commu = require("./models/commu");

mongoose.set('useUnifiedTopology',true)   
mongoose.set('useCreateIndex', true)
mongoose.connect("mongodb://localhost/ig_db", {useNewUrlParser: true});
mongoose.set('useFindAndModify',false)

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('express-session')({
    secret: 'Igproject',
    resave: false,
    saveUninitialized: false
}));



const newsRoutes = require("./routes/news"),
    indexRoutes = require("./routes/index"),
    commuRoutes = require("./routes/communication"),
    teamRoutes = require("./routes/team"),
    commentRoutes = require("./routes/comments"),
    reviewRoutes = require("./routes/review"),
    searchRoutes = require("./routes/search");

app.use(flash());
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());

app.set("views", [path.join(__dirname, "views"),
                    path.join(__dirname, "views/Login_Form"),
                    path.join(__dirname, "views/Forget_password"),
                    path.join(__dirname, "views/Sign_Up"),
                    path.join(__dirname, "views/Team"),
                    path.join(__dirname, "views/Home"),
                    path.join(__dirname, "views/News"),
                    path.join(__dirname, "views/column"),
                    path.join(__dirname, "views/review_game"),
                    path.join(__dirname, "views/Search")]);

app.set("view engine", "ejs");

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


app.use("/",indexRoutes);
app.use("/news", newsRoutes);
app.use("/team", teamRoutes);
app.use("/commu", commuRoutes);
app.use("/review", reviewRoutes);
app.use("/search", searchRoutes);
app.use("/:models/:id/comment", commentRoutes);


app.listen(3000, function(req,res){
    console.log("Server have started!!");
});

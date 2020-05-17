const express = require("express");
let app = express();
const path = require("path");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportLocal = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const flash = require('connect-flash');

mongoose.connect("mongodb://localhost/ig_db", {useNewUrlParser: true});
const User = require("./models/user");
mongoose.set('useCreateIndex', true)

app.use(bodyParser.urlencoded({extended: true}));
app.use(require('express-session')({
    secret: 'Igproject',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

const newsRoutes = require("./routes/news"),
    indexRoutes = require("./routes/index"),
    subjectRoutes = require("./routes/communication"),
    teamRoutes = require("./routes/team");


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
                    path.join(__dirname, "views/column")]);

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
app.use("/subject", subjectRoutes);


app.listen(3000, function(req,res){
    console.log("Server have started!!");
});

const tag = require("../models/tag");

const express = require("express"),
    router = express.Router(),
    multer = require('multer'),
    path = require('path'),
    fs = require('fs'),
    passport = require('passport'),
    User = require('../models/user'),
    News = require('../models/news'),
    middleware = require('../middleware'),
    Tag = require('../models/tag'),
    async = require('async');

var moment = require('moment');



module.exports = router;
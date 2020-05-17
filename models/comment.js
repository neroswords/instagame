const mongoose = require("mongoose");

var CommentSchema = new mongoose.Schema({
    content: String,
    user_post : String,
    date : Date,
 });


module.exports = mongoose.model("Comment", CommentSchema);
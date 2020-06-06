const mongoose = require("mongoose");

var CommentSchema = new mongoose.Schema({
    content: String,
    user_post : {
        id: {type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        alias: String
    },
    date : Date,
 });


module.exports = mongoose.model("Comment", CommentSchema);
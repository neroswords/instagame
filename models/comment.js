const mongoose = require("mongoose");

var CommentSchema = new mongoose.Schema({
    content: String,
    image : String,
    user_post : {
        id: {type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        alias: String,
        image : String
    },
    date : Date
 });


module.exports = mongoose.model("Comment", CommentSchema);
const mongoose = require("mongoose");

let TeamSchema = new mongoose.Schema({
    head : String,
    content : String,
    user_post : String,
    date : Date,
    game : String,
    appointment : Date,
    party : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Party"
    },
    comment : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


module.exports = mongoose.model("Team", TeamSchema);
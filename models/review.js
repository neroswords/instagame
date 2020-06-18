const mongoose = require("mongoose");

let ReviewSchema = new mongoose.Schema({
    head : String,
    content : String,
    image : String,
    viewers : Number,
    user_post : {
        id: {type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        alias: String
    },
    date : Date,
    game : String,
    comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    tags : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag"
        }
    ]
});


module.exports = mongoose.model("Review", ReviewSchema);
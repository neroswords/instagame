const mongoose = require("mongoose");

let NewsSchema = new mongoose.Schema({
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
    comment : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


module.exports = mongoose.model("News", NewsSchema);
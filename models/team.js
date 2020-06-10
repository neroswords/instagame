const mongoose = require("mongoose");

let TeamSchema = new mongoose.Schema({
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
    date_post : Date,
    game : String,
    appointment_date : String,
    appointment_time : String,
    number : Number,
    maxplayer : Number,
    party : [
        {type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


module.exports = mongoose.model("Team", TeamSchema);
const mongoose = require("mongoose");

let TeamSchema = new mongoose.Schema({
    head : String,
    content : String,
    user_post : {
        id: {type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        alias: String
    },
    date_post : Date,
    game : String,
    appointment_date : Date,
    appointment_time : String,
    number : Number,
    maxplayer : Number,
    party : {
        id : {type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        alias : String
    },
    comment : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


module.exports = mongoose.model("Team", TeamSchema);
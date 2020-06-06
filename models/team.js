const mongoose = require("mongoose");

let TeamSchema = new mongoose.Schema({
    head : String,
    content : String,
    user_post : String,
    date_post : Date,
    game : String,
    appointment_date : Date,
    appointment_time : String,
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
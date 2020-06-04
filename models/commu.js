const mongoose = require("mongoose");

let CommuSchema = new mongoose.Schema({
    head : String,
    content : String,
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

module.exports = mongoose.model("Commu", CommuSchema);
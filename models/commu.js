const mongoose = require("mongoose");

let CommuSchema = new mongoose.Schema({
    head : String,
    content : String,
    user_post : String,
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
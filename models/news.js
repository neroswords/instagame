const mongoose = require("mongoose");

let NewsSchema = new mongoose.Schema({
    head : String,
    content : String,
    user_post : String,
    date : Date,
    comment : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


module.exports = mongoose.model("News", NewsSchema);
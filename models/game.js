const mongoose = require("mongoose");

let GameSchema = new mongoose.Schema({
    name : String,
    comment : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag"
        }
    ]
});


module.exports = mongoose.model("Game", GameSchema);
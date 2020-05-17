const mongoose = require("mongoose");

let GameSchema = new mongoose.Schema({
    name : String,
    view : Float64Array,
    tag : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag"
        }
    ]
});


module.exports = mongoose.model("Game", GameSchema);
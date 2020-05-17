const mongoose = require("mongoose");

let TagSchema = new mongoose.Schema({
    name : String,
    tag : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag"
        }
    ]
});


module.exports = mongoose.model("Tag", TagSchema);
const mongoose = require("mongoose");

let PartySchema = new mongoose.Schema({
    number : Number,
    list : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "List"
        }
    ]
});


module.exports = mongoose.model("Party", PartySchema);
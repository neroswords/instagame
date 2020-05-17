const mongoose = require("mongoose");

let PartySchema = new mongoose.Schema({
    number : Int16Array,
    list : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "List"
        }
    ]
});


module.exports = mongoose.model("Party", PartySchema);
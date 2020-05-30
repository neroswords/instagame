const mongoose = require("mongoose");

let PartySchema = new mongoose.Schema({
    number : Number,
    list : {
        id: {type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        alias: String
    }
});


module.exports = mongoose.model("Party", PartySchema);
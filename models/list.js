const mongoose = require("mongoose");

let ListSchema = new mongoose.Schema({
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content : String,
    company : String
});

// not sure
module.exports = mongoose.model("List", ListSchema);
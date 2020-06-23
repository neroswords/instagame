const mongoose = require("mongoose");

let ListSchema = new mongoose.Schema({
    list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

// not sure
module.exports = mongoose.model("List", ListSchema);
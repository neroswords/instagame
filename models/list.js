const mongoose = require("mongoose");

let ListSchema = new mongoose.Schema({
    name : String,
});

// not sure
module.exports = mongoose.model("List", ListSchema);
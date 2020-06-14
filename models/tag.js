const mongoose = require("mongoose");

let TagSchema = new mongoose.Schema({
    name : String
});


module.exports = mongoose.model("Tag", TagSchema);
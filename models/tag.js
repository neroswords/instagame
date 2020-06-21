const mongoose = require("mongoose");

let TagSchema = new mongoose.Schema({
    name : String,
    type : String,
    view : Number
});


module.exports = mongoose.model("Tag", TagSchema);
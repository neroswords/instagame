const mongoose = require("mongoose");

let ListSchema = new mongoose.Schema({
    name : String,
});


module.exports = mongoose.model("List", ListSchema);
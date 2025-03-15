const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  id: String,
  name: String,
  country: String, // "India" or "International"
});

const Bank = mongoose.model("Bank", bankSchema);

module.exports = Bank;

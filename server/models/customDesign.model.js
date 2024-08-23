const mongoose = require("mongoose");

const customDesignSchema = new mongoose.Schema({
  title: String,
  image: String,
  summary: String,
  phone: String,
  date: String,
});

module.exports = mongoose.model("custom", customDesignSchema);

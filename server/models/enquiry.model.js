const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema({
  buyer: String,
  phone: String,
  products: String,
  price: String,
  date: String,
});

module.exports = mongoose.model("enquiry", EnquirySchema);

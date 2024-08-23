const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  number: { type: String, required: [true, "Number is required"] },
  house: { type: String },
  pincode: { type: String, required: [true, "Pincode is required"] },
  state: { type: String, required: [true, "State is required"] },
  address: { type: String, required: [true, "Address is required"] },
  city: { type: String, required: [true, "City is required"] },
});

module.exports = mongoose.model("address", addressSchema);

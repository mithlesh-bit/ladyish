const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  codeName: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  minimumCartValue: { type: Number, required: true },
  validity: { type: Date, required: true },
  category: { type: String, required: true }
});

module.exports = mongoose.model('Coupons', couponSchema);

const mongoose = require("mongoose");
const Coupon = require("../models/coupon.model"); // Ensure you import your models correctly


// Add a new coupon
exports.addCoupon = async (req, res) => {
  try {
    const { codeName, discountPercentage, minimumCartValue, validity, category } = req.body;
    const newCoupon = new Coupon({ codeName, discountPercentage, minimumCartValue, validity, category });
    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Validate a coupon code
exports.validateCoupon = async (req, res) => {
  try {
    const { codeName, cartValue } = req.body;
    const coupon = await Coupon.findOne({ codeName });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    if (cartValue < coupon.minimumCartValue) return res.status(400).json({ message: 'Cart value too low for this coupon' });
    if (new Date() > coupon.validity) return res.status(400).json({ message: 'Coupon has expired' });

    res.json({ valid: true, discountPercentage: coupon.discountPercentage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

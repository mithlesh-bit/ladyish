const purchaseService = require("../services/purchase.service");
const User = require("../models/user.model");
const Purchase = require("../models/purchase.model");
const Product = require("../models/product.model");

// get all purchases

exports.getAllPurchases = async (req, res, next) => {
  try {
    await purchaseService.getAllPurchases(res);
  } catch (error) {
    next(error);
  } finally {
    console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

exports.getPurchasesSeller = async (req, res) => {
  
  
  try {
    const purchases = await Purchase.find();

    const reversedPurchases = purchases.reverse();

    res.status(200).json({
      success: true,
      count: reversedPurchases.length,
      data: reversedPurchases,
    });
  } catch (error) {
    // Handle potential errors
    res.status(500).json({
      success: false,
      message: "Failed to retrieve purchases",
      error: error.message,
    });
  }
};

// update purchase status// purchase.controller.js
exports.updatePurchaseStatus = async (req, res, next) => {
  try {
    const statusUpdate = await purchaseService.updatePurchaseStatus(
      req.params.id,
      req.body.status
    );
    res.status(200).json(statusUpdate);
  } catch (error) {
    next(error);
  } finally {
    console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

exports.addPurchase = async (req, res, next) => {
  const { userId } = req.params;
  const { productId, quantity, price } = req.body;

  try {
    const newPurchase = new Purchase({
      productId,
      quantity,
      price,
      user: userId,
    });

    await newPurchase.save();

    console.log(8546);

    const product = await Product.findOne({ _id: productId });
    product.buyers.push(userId);
    const user = await User.findById(userId);
    user.purchases.push(newPurchase);
    await user.save();

    res
      .status(201)
      .send({ message: "Purchase added successfully", data: newPurchase });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add purchase", error: error.message });
  }
};

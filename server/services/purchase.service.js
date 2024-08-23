/**
 * Title: Write a program using JavaScript on Purchase Service
 * Author: Hasibul Islam
 * Portfolio: https://devhasibulislam.vercel.app
 * Linkedin: https://linkedin.com/in/devhasibulislam
 * GitHub: https://github.com/devhasibulislam
 * Facebook: https://facebook.com/devhasibulislam
 * Instagram: https:/instagram.com/devhasibulislam
 * Twitter: https://twitter.com/devhasibulislam
 * Pinterest: https://pinterest.com/devhasibulislam
 * WhatsApp: https://wa.me/8801906315901
 * Telegram: devhasibulislam
 * Date: 09, January 2024
 */

const Purchase = require("../models/purchase.model");

// get all purchases
async function getAllPurchases(res) {
  const purchases = await Purchase.find().populate([
    "customer",
    "products.product",
  ]);

  res.status(200).json({
    acknowledgement: true,
    message: "Ok",
    description: "Purchases fetched successfully",
    data: purchases,
  });
}

// update purchase status
// purchase.service.js
async function updatePurchaseStatus(id, status) {
  try {
    const result = await Purchase.findByIdAndUpdate(
      id,
      {
        $set: { status: status },
      },
      { new: true, runValidators: true }
    );

    return {
      acknowledgement: true,
      message: "Ok",
      description: "Purchase status updated successfully",
      data: result,
    };
  } catch (error) {
    throw new Error(`Error updating purchase status: ${error.message}`);
  }
}

module.exports = {
  getAllPurchases,
  updatePurchaseStatus,
};

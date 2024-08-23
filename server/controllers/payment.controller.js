// const paymentService = require("../services/payment.service");

// // create payment
// exports.createPayment = async (req, res, next) => {
//   try {
//     await paymentService.createPayment(req, res);
//   } catch (err) {
//     next(err);
//   } finally {
//     console.log(`Route: ${req.url} || Method: ${req.method}`);
//   }
// };

// const express = require("express");
// const Razorpay = require("razorpay");
// const cors = require("cors");
// const crypto = require("crypto");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT;

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cors());

// app.post("/order", async (req, res) => {
//   try {
//     const razorpay = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_SECRET,
//     });

//     const options = req.body;
//     const order = await razorpay.orders.create(options);

//     if (!order) {
//       return res.status(500).send("Error");
//     }

//     res.json(order);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error");
//   }
// });

// app.post("/order/validate", async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;

//   const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
//   //order_id + "|" + razorpay_payment_id
//   sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
//   const digest = sha.digest("hex");
//   if (digest !== razorpay_signature) {
//     return res.status(400).json({ msg: "Transaction is not legit!" });
//   }

//   res.json({
//     msg: "success",
//     orderId: razorpay_order_id,
//     paymentId: razorpay_payment_id,
//   });
// });

// app.listen(PORT, () => {
//   console.log("Listening on port", PORT);
// });

const Razorpay = require("razorpay");
const crypto = require("crypto");
const verify = require("../middleware/verify.middleware");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const Product = require("../models/product.model");
exports.postOrder = async (req, res, next) => {
  console.log(1111);
  console.log(req.body);
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
console.log(222);

    const options = req.body;
    const order = await razorpay.orders.create(options);
console.log(33,order);

    if (!order) {
      return res.status(500).send("Error");
    }   

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
};

const Purchase = require("../models/purchase.model"); // Make sure to require the Purchase model
const { promisify } = require("util");

exports.orderValidate = async (req, res, next) => {
  // console.log("Validating order...", req.body);
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userToken,
    address,
    products,
    amount,
  } = req.body;

  console.log(products, products.product);

  try {
    // Validating the payment signature
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    if (digest !== razorpay_signature) {
      console.log("Signature mismatch");
      return res.status(400).json({
        status: "failed",
        msg: "Transaction is not legit!",
      });
    }

    // Decode the user token to get user ID
    const decoded = await promisify(jwt.verify)(
      userToken,
      process.env.TOKEN_SECRET
    );
    const userId = decoded;
    // console.log("USER HAI BHAI", userId);

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Create a new purchase record
    const newPurchase = await Purchase.create({
      customer: user._id,
      products: products,
      customerId: user._id, // Assuming customerId is the same as userId
      orderId: razorpay_order_id,
      address: address,
      totalAmount: amount,
      status: "Ordered",
    });

    // Update user's purchases array
    console.log(255555);

    const productsAll = await Product.find({
      _id: { $in: products.map((p) => p.product) },
    });

    productsAll.forEach((product) => {
      product.buyers.push(userId);
    });

    // Save the updated products back to the database
    const updatedProducts = await Promise.all(
      productsAll.map((product) => product.save())
    );

    console.log("Updated Products:", updatedProducts);

    user.purchases.push(newPurchase._id);

    await user.save();

    console.log("Order validated and user updated with new purchase");
    res.status(200).json({
      status: "success",
      msg: "Payment verified and order stored successfully",
      orderDetails: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        purchaseId: newPurchase._id,
      },
    });
  } catch (error) {
    console.log("Server error during validation:", error.message);
    return res.status(500).json({
      status: "error",
      msg: "Server error during validation",
      error: error.message,
    });
  }
};

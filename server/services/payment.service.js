const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Purchase = require("../models/purchase.model");
const User = require("../models/user.model");
const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

app.post("/order/validate", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  //order_id + "|" + razorpay_payment_id
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
  }

  res.json({
    msg: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});

module.exports = router;

// app.listen(PORT, () => {
//   console.log("Listening on port", PORT);
// });

// /* stripe setup */
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// // create payment
// exports.createPayment = async (req, res) => {
//   const lineItems = req.body.map((item) => {
//     return {
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: item.name,
//           images: [item.thumbnail],
//           description: item.description,
//           metadata: {
//             id: item.pid,
//           },
//         },
//         unit_amount: item.price * 100,
//       },
//       quantity: item.quantity,
//     };
//   });

//   const session = await stripe.checkout.sessions.create({
//     line_items: lineItems,
//     mode: "payment",
//     success_url: `${process.env.ORIGIN_URL}`,
//     cancel_url: `${process.env.ORIGIN_URL}`,
//   });

//   // create purchase for user
//   const purchase = await Purchase.create({
//     customer: req.user._id,
//     customerId: session.id,
//     orderId: session.id,
//     totalAmount: session.amount_total,
//     products: req.body.map((item) => ({
//       product: item.pid,
//       quantity: item.quantity,
//     })),
//   });

//   // add purchase._id to user's purchases array, add pid from req.body array of object to user's products array and empty user's cart array
//   await User.findByIdAndUpdate(req.user._id, {
//     $push: { purchases: purchase._id },
//     $set: { cart: [] },
//   });

//   // add pid from req.body array of object to user's products array
//   req.body.forEach(async (item) => {
//     await User.findByIdAndUpdate(req.user._id, {
//       $push: { products: item.pid },
//     });
//   });

//   // remove all carts that cart._id match with cid from req.body's array of object
//   req.body.forEach(async (cart) => {
//     await Cart.findByIdAndDelete(cart.cid);
//   });

//   // add user to products buyers array
//   req.body.forEach(async (product) => {
//     await Product.findByIdAndUpdate(product.pid, {
//       $push: { buyers: req.user._id },
//     });
//   });

//   res.status(201).json({
//     acknowledgement: true,
//     message: "Ok",
//     description: "Payment created successfully",
//     url: session.url,
//   });
// };

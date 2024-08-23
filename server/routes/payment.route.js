/* external import */
// const express = require("express");

// /* middleware imports */
// const verify = require("../middleware/verify.middleware");
// const authorize = require("../middleware/authorize.middleware");

// /* internal import */
// const paymentController = require("../controllers/payment.controller");

// /* router level connection */
// const router = express.Router();

// /* router methods integration */

// // create payment
// router.post(
//   "/create-payment",
//   verify,
//   authorize("buyer"),
//   paymentController.createPayment
// );

// /* export router */
// module.exports = router;

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

// /* router level connection */
// const router = express.Router();
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
//   console.log(111);
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

// module.exports = router;

// // app.listen(PORT, () => {
// //   console.log("Listening on port", PORT);
// // });

const express = require("express");
const router = express.Router();

// Controllers
const paymentcontroller = require("../controllers/payment.controller");

router.post("/order", paymentcontroller.postOrder);
router.post("/order/validate", paymentcontroller.orderValidate);

module.exports = router;

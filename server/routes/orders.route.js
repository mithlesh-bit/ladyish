const express = require("express");

/* middleware imports */
const verify = require("../middleware/verify.middleware");
const authorize = require("../middleware/authorize.middleware");

/* internal import */
const ordersController = require("../controllers/orders.controller");

/* router level connection */
const router = express.Router();

/* router methods integration */

// add to cart
router.post(
  "/getAllOrders",
  verify,
  authorize("seller"),
  ordersController.getAllOrders
);

// router.delete(
//   "/delete-address/:id",
//   verify,
//   authorize("buyer"),
//   cartController.deleteAddress
// );

// router.get("/user/:userId/addresses", cartController.getUserAddresses);
module.exports = router;

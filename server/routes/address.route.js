const express = require("express");

/* middleware imports */
const verify = require("../middleware/verify.middleware");
const authorize = require("../middleware/authorize.middleware");

/* internal import */
const cartController = require("../controllers/address.controller");

/* router level connection */
const router = express.Router();

/* router methods integration */

// add to cart
router.post(
  "/add-address",
  verify,
  authorize("buyer"),
  cartController.addAddress
);

router.delete(
  "/delete-address/:id",
  verify,
  authorize("buyer"),
  cartController.deleteAddress
);

router.get("/adress-details/:addressId", cartController.getAdressDetails);

router.get("/user/:userId/addresses", cartController.getUserAddresses);
module.exports = router;

/* external import */
const express = require("express");

/* middleware imports */
const verify = require("../middleware/verify.middleware");
const authorize = require("../middleware/authorize.middleware");

/* internal import */
const purchaseController = require("../controllers/purchase.controller");

/* router level connection */
const router = express.Router();

// get all purchases
router.get(
  "/get-all-purchases",
  verify,
  authorize("admin"),
  purchaseController.getAllPurchases
);

router.get("/orders", purchaseController.getPurchasesSeller);

// update purchase status
router.post(
  "/update-purchase-status/:id",
  purchaseController.updatePurchaseStatus
);

router.post(
  "/add-purchases",
  verify,
  authorize("admin"),
  purchaseController.addPurchase
);
/* export purchase router */
module.exports = router;

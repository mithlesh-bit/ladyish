/* external import */
const express = require("express");

/* middleware imports */
const upload = require("../middleware/upload.middleware");

/* internal import */
const brandController = require("../controllers/brand.controller");
const verify = require("../middleware/verify.middleware");
const authorize = require("../middleware/authorize.middleware");

/* router level connection */
const router = express.Router();

/* router methods integration */

// add new brand
router.post(
  "/add-brand",
  verify,
  authorize("admin", "seller"),
  upload.single("logo"),
  brandController.addBrand
);

// get all brands
router.get("/get-brands", brandController.getBrands);

// get a brand
router.get("/get-brand/:id", brandController.getBrand);

// update brand
router.patch(
  "/update-brand/:id",
  verify,
  authorize("admin", "seller"),
  upload.single("logo"),
  brandController.updateBrand
);

// delete brand
router.delete(
  "/delete-brand/:id",
  verify,
  authorize("admin", "seller"),
  brandController.deleteBrand
);

module.exports = router;

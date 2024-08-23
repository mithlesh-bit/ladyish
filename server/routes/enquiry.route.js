const express = require("express");
const authorize = require("../middleware/authorize.middleware");
const enquiryController = require("../controllers/enquiry.controller");
const router = express.Router();

router.post("/purchase-enquiry", enquiryController.enquiryController);

router.get("/get-enquiry", enquiryController.getAllData);

router.delete(
  "/delete-enquiry/:id",
  //authorize("admin", "seller"),
  enquiryController.deleteEnquiry
);

module.exports = router;

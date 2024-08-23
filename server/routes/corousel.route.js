const express = require("express");
const upload = require("../multer");

/* middleware imports */
const verify = require("../middleware/verify.middleware");
const authorize = require("../middleware/authorize.middleware");

/* internal import */
const corouselController = require("../controllers/corousel.controller");

/* router level connection */
const router = express.Router();

/* router methods integration */

// add to favorite
router.post(
  "/corousel-post",
  upload.single("image"),
  corouselController.corouselController
);

router.get("/get-corousel", corouselController.getAllData);

router.delete(
  "/delete-corousel/:id",
  //authorize("admin", "seller"),
  corouselController.deleteCorousel
);

module.exports = router;

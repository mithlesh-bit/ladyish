const express = require("express");
const upload = require("../middleware/upload.middleware");

/* middleware imports */
const verify = require("../middleware/verify.middleware");
const authorize = require("../middleware/authorize.middleware");

/* internal import */
const customController = require("../controllers/customDesign.controller");

/* router level connection */
const router = express.Router();

/* router methods integration */


// add to favorite
router.post(
  "/custom",
  upload.single("file"),
  customController.customController
);

router.get("/get-custom-designs", customController.getAllData);

router.delete(
  "/delete-design/:id",
  //authorize("admin", "seller"),
  customController.deleteDesign
);

module.exports = router;

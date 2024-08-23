const express = require("express");
const router = express.Router();

// Controllers
const privacyPolicyController = require("../controllers/policy.controller");

router.get("/privacy-policy", privacyPolicyController.getPrivacyPolicy);

module.exports = router;

/* external import */
const express = require("express");

/* middleware imports */
const upload = require("../middleware/upload.middleware");
const verify = require("../middleware/verify.middleware");

/* internal import */
const userController = require("../controllers/user.controller");
const authorize = require("../middleware/authorize.middleware");

/* router level connection */
const router = express.Router();

/* router methods integration */

// sign up an user
router.post("/sign-up", upload.single("avatar"), userController.signUp);

// sign in an user
router.post("/sign-in", userController.signIn);

router.post("/otp-verify", userController.otp);

// reset user password
router.patch("/forgot-password", userController.forgotPassword);

// login persistance
router.get("/me", verify, userController.persistLogin);

// get all users
router.get("/all-users", verify, authorize("admin"), userController.getUsers);
router.get("/get-user-details/:id", userController.getUsersDetails);

// get single user
router.get("/get-user/:id", verify, authorize("admin"), userController.getUser);

// update user information
router.patch(
  "/update-information",
  verify,
  authorize("admin", "seller", "buyer"),
  upload.single("avatar"),
  userController.updateUser
);

router.patch(
  "/update-user/:id",
  verify,
  authorize("admin"),
  upload.single("avatar"),
  userController.updateUserInfo
);

// delete user information
router.delete(
  "/delete-user/:id",
  verify,
  authorize("admin", "seller", "buyer"),
  userController.deleteUser
);

// seller request and approve
router
  .route("/seller-review")
  .get(verify, authorize("admin"), userController.getSellers)
  .patch(verify, authorize("admin"), userController.reviewSeller);

/* export user router */
module.exports = router;

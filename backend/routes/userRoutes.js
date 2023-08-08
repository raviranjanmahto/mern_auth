const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.post("/logout", userController.logout);

router
  .route("/profile")
  .get(authMiddleware.protect, userController.getProfile)
  .put(authMiddleware.protect, userController.updateProfile);
module.exports = router;

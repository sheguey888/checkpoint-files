const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
const { loginLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Local auth
router.post("/signup", authController.signup);
router.post("/login", loginLimiter, authController.login);
router.get("/logout", authController.logout);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.googleCallback,
);

module.exports = router;

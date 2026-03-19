const express = require("express");
const { login, verify, profile, updateProfile, logout, signup } = require("../controllers/authController");
const { validate } = require("../middlewares/validate");
const { auth } = require("../middlewares/auth");
const { loginSchema, verifySchema, updateProfileSchema, signupSchema } = require("../validators/authValidators");

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/signup", validate(signupSchema), signup);
router.post("/verify-otp", validate(verifySchema), verify);
router.get("/profile", auth, profile);
router.patch("/profile", auth, validate(updateProfileSchema), updateProfile);
router.post("/logout", auth, logout);

module.exports = router;

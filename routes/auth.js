const express = require("express");
const { sendOTPRegister, verifyOTP, signIn } = require("../controllers/auth");
const router = express.Router();

router.post("/register", sendOTPRegister);
router.post("/verifyotp", verifyOTP);
router.post("/signin", signIn);

module.exports = router;

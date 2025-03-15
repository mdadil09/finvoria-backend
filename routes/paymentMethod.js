const express = require("express");
const {
  addPaymentMethod,
  getPaymentMethod,
} = require("../controllers/PaymentMethod");
const { sendOtp } = require("../config/sendWalletOtp");
const router = express.Router();

router.post("/add-payment-method", addPaymentMethod);
router.get("/get-payment-method/:userId", getPaymentMethod);
router.post("/send-otp", sendOtp);

module.exports = router;

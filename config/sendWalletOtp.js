const determineInputType = require("../utils/utils");
const otpGenerator = require("otp-generator");
const redisClient = require("./redisClient");
const { sendWalletVerificationEmail } = require("../services/email");

const sendOtp = async (req, res) => {
  try {
    const { walletId } = req.body;

    const inputType = determineInputType(walletId);

    if (inputType === "invalid") {
      return res.status(400).json({ message: "Invalid email or phone number" });
    }

    console.log(`Sending OTP to ${inputType}:`, walletId);

    if (inputType === "email") {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      const res = await sendWalletVerificationEmail(walletId, otp);
      const data = {
        email: walletId,
        otp: otp,
      };
      await redisClient.setEx(walletId, 600, JSON.stringify(data));
    } else if (inputType === "phone") {
      console.log(`Sending OTP to ${inputType}:`, walletId);
      //   await sendSmsOtp(input);
    }

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { sendOtp };

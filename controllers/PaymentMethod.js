const { encrypt, decrypt } = require("../config/encryption");
const redisClient = require("../config/redisClient");
const PaymentMethod = require("../models/PaymentSchema");

const addPaymentMethod = async (req, res) => {
  try {
    const { userId, type, details } = req.body;

    if (!userId || !type || !details) {
      return res.status(400).json({ message: "Invalid request" });
    }

    let existingPaymentMethod = await PaymentMethod.findOne({ userId });

    let paymentData = {};

    switch (type) {
      case "card":
        if (!details.cardNumber || details.cardNumber.length < 15) {
          return res.status(400).json({ message: "Invalid card number" });
        }

        if (existingPaymentMethod) {
          const existingCards = await Promise.all(
            existingPaymentMethod.methods
              .filter((m) => m.type === "card")
              .map(async (m) => await decrypt(m.cardNumber))
          );

          console.log("Existing Card IDs:", existingCards);

          if (existingCards.includes(details.cardNumber)) {
            return res.status(400).json({ message: "Card already exists!" });
          }
        }

        paymentData = {
          type: "card",
          provider: details.provider,
          last4: details.cardNumber.slice(-4),
          expiry: details.expiry,
          cardNumber: await encrypt(details.cardNumber),
          cardHolderName: details.cardHolderName,
          cvc: await encrypt(details.cvc),
          addedAt: new Date(),
        };
        break;

      case "upi":
        if (existingPaymentMethod) {
          const existingUpiIds = await Promise.all(
            existingPaymentMethod.methods
              .filter((m) => m.type === "upi")
              .map(async (m) => await decrypt(m.upiId))
          );

          console.log("Existing UPI IDs:", existingUpiIds);

          if (existingUpiIds.includes(details.upiId)) {
            return res.status(400).json({ message: "UPI ID already exists!" });
          }
        }

        paymentData = {
          type: "upi",
          upiId: await encrypt(details.upiId),
          addedAt: new Date(),
        };
        break;

      case "netbanking":
        if (existingPaymentMethod) {
          const existingBankAccount = await Promise.all(
            existingPaymentMethod.methods
              .filter((m) => m.type === "netbanking")
              .map(async (m) => await decrypt(m.accountNumber))
          );

          console.log("Existing:", existingBankAccount);

          if (existingBankAccount.includes(details.accountNumber)) {
            return res
              .status(400)
              .json({ message: "Bank account already added!" });
          }
        }

        paymentData = {
          type: "netbanking",
          bankName: details.bankName,
          accountNumber: await encrypt(details.accountNumber),
          ifscCode: details.ifscCode,
          accountType: details.account,
          accountHolderName: details.accountHolderName,
          privacyConsent: details.privacyConsent,
          addedAt: new Date(),
        };
        break;

      case "wallet":
        if (
          existingPaymentMethod &&
          existingPaymentMethod.methods.some(
            (m) => m.type === "wallet" && m.walletName === details.walletName
          )
        ) {
          return res
            .status(400)
            .json({ message: "Wallet with this email already exists" });
        }

        if (details.walletName === "Finvoria") {
          const { details } = req.body;

          const data = await redisClient.get(details.walletId);
          if (!data) {
            return res
              .status(400)
              .json({ message: "OTP expired or not found." });
          }

          const walletData = JSON.parse(data);

          if (details.otp !== walletData.otp) {
            return res.status(400).json({
              message: "The OTP you entered is incorrect. Please try again.",
            });
          }
        }

        paymentData = {
          type: "wallet",
          walletName: details.walletName,
          walletId: details.walletId,
          addedAt: new Date(),
        };
        break;

      default:
        return res.status(400).json({ message: "Invalid payment method" });
    }

    if (existingPaymentMethod) {
      await PaymentMethod.findOneAndUpdate(
        { userId },
        { $push: { methods: paymentData } },
        { new: true }
      );
    } else {
      existingPaymentMethod = await PaymentMethod.create({
        userId,
        methods: [paymentData],
      });
    }

    return res.status(201).json({
      success: true,
      message: "Payment method added",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPaymentMethod = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const paymentMethod = await PaymentMethod.find({ userId });

    if (!paymentMethod) {
      return res.status(404).json({ message: "No payment method found" });
    }

    return res.status(200).json({
      success: true,
      message: "Payment method found",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addPaymentMethod, getPaymentMethod };

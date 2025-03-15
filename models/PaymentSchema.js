const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  methods: [
    {
      type: {
        type: String,
        enum: ["card", "upi", "netbanking", "wallet"],
        required: true,
      },
      provider: String,
      cardNumber: String,
      expiry: String,
      bankName: String,
      accountNumber: String,
      ifscCode: String,
      walletName: String,
      last4: String,
      expiry: String,
      upiId: String,
      walletId: String,
      cardHolderName: String,
      cvc: String,
      accountType: String,
      accountHolderName: String,
      privacyConsent: Boolean,
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);
module.exports = PaymentMethod;

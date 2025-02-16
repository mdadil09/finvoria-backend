const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "https://github.com/shadcn.png" },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    isPhoneVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

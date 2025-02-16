const User = require("../models/auth-model");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const generateToken = require("../utils/generateToken");
const redisClient = require("../config/redisClient");
const { sendVerificationEmail } = require("../services/email");

const sendOTPRegister = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    console.log(req.body);

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Please fill required fields." });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await sendVerificationEmail(email, otp);

    const userData = {
      name,
      email,
      phone,
      password: hashedPassword,
      otp,
    };

    await redisClient.setEx(email, 600, JSON.stringify(userData));

    console.log(`Generated OTP for ${email}: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please verify.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const data = await redisClient.get(email);
    if (!data) {
      return res.status(400).json({ message: "OTP expired or not found." });
    }

    const userData = JSON.parse(data);

    if (otp !== userData.otp) {
      return res.status(400).json({
        message: "The OTP you entered is incorrect. Please try again.",
      });
    }

    const newUser = await User.create({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      profilePicture: userData.profilePicture,
      role: "USER",
    });

    console.log(newUser);

    await redisClient.del(email);

    res.status(200).json({
      success: true,
      message: "User registered successfully.",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        isPhoneVerified: newUser.isPhoneVerified,
        profilePicture: userData.profilePicture,
      },
      token: generateToken(newUser._id, "USER"),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        res.status(401).send({ message: "Password is wrong" });
      } else {
        res.status(200).send({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isPhoneVerified: user.isPhoneVerified,
            profilePicture: user.profilePicture,
          },
          token: generateToken(user._id, user.role),
          message: "LoggedIn Successfully!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  sendOTPRegister,
  verifyOTP,
  signIn,
};

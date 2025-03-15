const Bank = require("../models/bank-schema");

const getBank = async (req, res) => {
  try {
    const banks = await Bank.find();
    res.status(200).json({
      success: true,
      message: "Bank fetched successfully.",
      banks: banks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getBank };

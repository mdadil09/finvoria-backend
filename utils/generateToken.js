const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;

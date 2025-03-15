require("dotenv").config();
const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const secretKey = Buffer.from(process.env.ENCRYPTION_SECRET_KEY, "hex");
const iv = Buffer.from(process.env.ENCRYPTION_IV, "hex");

const encrypt = async (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = async (encryptedText) => {
  if (!encryptedText) {
    throw new Error("Invalid encrypted text: received undefined or null");
  }

  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = { encrypt, decrypt };

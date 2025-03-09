const express = require("express");
const multer = require("multer");
const { addContacts, getContacts } = require("../controllers/contacts");
const router = express.Router();
const { storage } = require("../services/cloudinary");

const upload = multer({ storage });

router.post("/add-contact", upload.single("image"), addContacts);
router.get("/get-contacts/:id", getContacts);

module.exports = router;

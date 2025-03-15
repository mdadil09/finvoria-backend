const express = require("express");
const { getBank } = require("../controllers/bank");
const router = express.Router();

router.get("/get-banks", getBank);

module.exports = router;

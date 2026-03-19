const express = require("express");
const { auth } = require("../middlewares/auth");
const { insights } = require("../controllers/assistantController");

const router = express.Router();

router.get("/insights", auth, insights);

module.exports = router;

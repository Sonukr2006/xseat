const express = require("express");
const { auth } = require("../middlewares/auth");
const { getTravelHistory } = require("../controllers/userController");

const router = express.Router();

router.get("/travel-history", auth, getTravelHistory);

module.exports = router;

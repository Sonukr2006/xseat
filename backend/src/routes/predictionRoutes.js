const express = require("express");
const { auth } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const { waitlist } = require("../controllers/predictionController");
const { waitlistSchema } = require("../validators/predictionValidators");

const router = express.Router();

router.get("/waitlist", auth, validate(waitlistSchema), waitlist);

module.exports = router;

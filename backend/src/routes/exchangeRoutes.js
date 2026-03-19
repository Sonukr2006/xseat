const express = require("express");
const { auth } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const { requestExchange, listMatches, confirmExchange } = require("../controllers/exchangeController");
const { exchangeRequestSchema, confirmSchema } = require("../validators/exchangeValidators");

const router = express.Router();

router.post("/request", auth, validate(exchangeRequestSchema), requestExchange);
router.get("/matches", auth, listMatches);
router.post("/confirm", auth, validate(confirmSchema), confirmExchange);

module.exports = router;

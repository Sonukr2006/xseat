const express = require("express");
const { auth } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const { listMessages, sendMessage } = require("../controllers/chatController");
const { sendMessageSchema } = require("../validators/chatValidators");

const router = express.Router();

router.get("/:matchId", auth, listMessages);
router.post("/:matchId", auth, validate(sendMessageSchema), sendMessage);

module.exports = router;

const express = require("express");
const { auth } = require("../middlewares/auth");
const { listNotifications, markRead, registerDevice } = require("../controllers/notificationController");

const router = express.Router();

router.get("/", auth, listNotifications);
router.post("/register", auth, registerDevice);
router.post("/:id/read", auth, markRead);

module.exports = router;

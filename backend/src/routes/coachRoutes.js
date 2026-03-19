const express = require("express");
const { auth } = require("../middlewares/auth");
const { coachMap } = require("../controllers/coachController");

const router = express.Router();

router.get("/map", auth, coachMap);

module.exports = router;

const express = require("express");
const { auth, adminOnly } = require("../middlewares/auth");
const {
  analytics,
  listUsers,
  listExchanges,
  listMatches,
  adminDashboard,
  listTickets,
  listNotifications,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/analytics", auth, adminOnly, analytics);
router.get("/dashboard", auth, adminOnly, adminDashboard);
router.get("/users", auth, adminOnly, listUsers);
router.get("/tickets", auth, adminOnly, listTickets);
router.get("/exchanges", auth, adminOnly, listExchanges);
router.get("/matches", auth, adminOnly, listMatches);
router.get("/notifications", auth, adminOnly, listNotifications);

module.exports = router;

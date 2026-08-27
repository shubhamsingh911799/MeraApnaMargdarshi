const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getTodayPlan,
  toggleTask,
} = require("../controllers/dailyPlanController");

/**
 * ==========================================
 * Daily Plan Routes
 * ==========================================
 */

// Get today's plan
router.get(
  "/today",
  authMiddleware,
  getTodayPlan
);

// Toggle task completion
router.patch(
  "/:planId/tasks/:taskId",
  authMiddleware,
  toggleTask
);

module.exports = router;
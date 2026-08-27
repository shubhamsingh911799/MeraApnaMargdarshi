const express = require('express');

const {
  generateHealthPlan,
  getHealthPlan,
} = require('../controllers/healthPlanController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/*
  Generate / update personalized 12-month health plan
  POST /api/health/plan
*/
router.post(
  '/plan',
  authMiddleware,
  generateHealthPlan
);

/*
  Get existing health plan
  GET /api/health/plan
*/
router.get(
  '/plan',
  authMiddleware,
  getHealthPlan
);

module.exports = router;
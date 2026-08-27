const express = require('express');
const validate = require("../middleware/validate");

const {
  healthProfileSchema,
} = require("../validators/healthValidator");
const {
  saveHealthProfile,
  getHealthProfile,
  getHealthAnalysis,
  resetHealthProfile,
} = require('../controllers/healthController');

const {
  generateHealthPlan,
  getHealthPlan,
} = require('../controllers/healthPlanController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/* =========================================================
   HEALTH API STATUS
   ========================================================= */

router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Health API is running',
  });
});

/* =========================================================
   HEALTH PROFILE
   ========================================================= */

router.post(
  "/profile",
  authMiddleware,
  validate(healthProfileSchema),
  saveHealthProfile
);
router.get('/profile', authMiddleware, getHealthProfile);
router.delete('/profile', authMiddleware, resetHealthProfile);

/* =========================================================
   HEALTH ANALYSIS
   ========================================================= */

router.get('/analysis', authMiddleware, getHealthAnalysis);

/* =========================================================
   HEALTH PLAN
   ========================================================= */

router.post('/plan', authMiddleware, generateHealthPlan);

router.get('/plan', authMiddleware, getHealthPlan);

module.exports = router;
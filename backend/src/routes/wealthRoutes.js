const express = require('express');
const {
  saveWealthProfile,
  getWealthProfile,
  getWealthAnalysis,
  generateWealthPlan,
  getWealthPlan,
  resetWealthProfile,
} = require('../controllers/wealthController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/* =========================================================
   WEALTH API STATUS
========================================================= */

router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Wealth API is running',
  });
});

/* =========================================================
   WEALTH PROFILE
========================================================= */

router.post('/profile', authMiddleware, saveWealthProfile);
router.get('/profile', authMiddleware, getWealthProfile);
router.delete('/profile', authMiddleware, resetWealthProfile);

/* =========================================================
   WEALTH ANALYSIS
========================================================= */

router.get('/analysis', authMiddleware, getWealthAnalysis);

/* =========================================================
   WEALTH PLAN
========================================================= */

router.post('/plan', authMiddleware, generateWealthPlan);
router.get('/plan', authMiddleware, getWealthPlan);

module.exports = router;

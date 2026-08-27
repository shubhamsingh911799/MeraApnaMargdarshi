const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { growthProfileSchema, reflectionSchema } = require('../validators/growthValidator');
const {
  saveGrowthProfile,
  getGrowthProfile,
  getGrowthRoadmap,
  completeTask,
  saveReflection,
  resetGrowthProfile,
} = require('../controllers/growthController');

/* =========================================================
   GROWTH ROUTES
========================================================= */

router.get('/profile', authMiddleware, getGrowthProfile);
router.post('/profile', authMiddleware, validate(growthProfileSchema), saveGrowthProfile);
router.put('/profile', authMiddleware, validate(growthProfileSchema), saveGrowthProfile);
router.delete('/profile', authMiddleware, resetGrowthProfile);

router.get('/roadmap', authMiddleware, getGrowthRoadmap);
router.post('/tasks/:taskId/complete', authMiddleware, completeTask);
router.post('/reflection', authMiddleware, validate(reflectionSchema), saveReflection);

module.exports = router;

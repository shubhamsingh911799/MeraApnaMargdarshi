const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const {
  saveGrowthProfileService,
  getGrowthProfileService,
  completeGrowthTaskService,
  saveGrowthReflectionService,
} = require('../services/growthService');

/* =========================================================
   SAVE / UPDATE GROWTH PROFILE
========================================================= */

const saveGrowthProfile = asyncHandler(async (req, res) => {
  const profile = await saveGrowthProfileService(req.user._id, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, { growthProfile: profile }, 'Growth profile saved successfully.'));
});

/* =========================================================
   GET GROWTH PROFILE
========================================================= */

const getGrowthProfile = asyncHandler(async (req, res) => {
  const profile = await getGrowthProfileService(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, { growthProfile: profile }, 'Growth profile fetched successfully.'));
});

/* =========================================================
   GET ROADMAP
========================================================= */

const getGrowthRoadmap = asyncHandler(async (req, res) => {
  const profile = await getGrowthProfileService(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, { roadmap: profile.roadmap }, 'Roadmap fetched successfully.'));
});

/* =========================================================
   COMPLETE TASK
========================================================= */

const completeTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const profile = await completeGrowthTaskService(req.user._id, taskId);
  return res
    .status(200)
    .json(new ApiResponse(200, { growthProfile: profile }, 'Task marked complete.'));
});

/* =========================================================
   SAVE REFLECTION
========================================================= */

const saveReflection = asyncHandler(async (req, res) => {
  const profile = await saveGrowthReflectionService(req.user._id, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, { growthProfile: profile }, 'Weekly reflection saved successfully.'));
});

const GrowthProfile = require('../models/GrowthProfile');

/* =========================================================
   RESET GROWTH PROFILE
========================================================= */

const resetGrowthProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  await GrowthProfile.deleteMany({ user: userId });
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Growth profile reset successfully.'));
});

module.exports = {
  saveGrowthProfile,
  getGrowthProfile,
  getGrowthRoadmap,
  completeTask,
  saveReflection,
  resetGrowthProfile,
};

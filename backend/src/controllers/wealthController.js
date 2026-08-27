const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const {
  saveWealthProfileService,
  getWealthProfileService,
  getWealthAnalysisService,
  generateWealthPlanService,
  getWealthPlanService,
} = require("../services/wealthService");

/* =========================================================
   SAVE WEALTH PROFILE
========================================================= */

const saveWealthProfile = asyncHandler(async (req, res) => {
  const profile = await saveWealthProfileService(req.user._id, req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      { wealthProfile: profile },
      "Wealth profile saved successfully."
    )
  );
});

/* =========================================================
   GET WEALTH PROFILE
========================================================= */

const getWealthProfile = asyncHandler(async (req, res) => {
  const profile = await getWealthProfileService(req.user._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      { wealthProfile: profile },
      "Wealth profile fetched successfully."
    )
  );
});

/* =========================================================
   GET WEALTH ANALYSIS
========================================================= */

const getWealthAnalysis = asyncHandler(async (req, res) => {
  const analysis = await getWealthAnalysisService(req.user._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      analysis,
      "Wealth analysis generated successfully."
    )
  );
});

/* =========================================================
   GENERATE WEALTH PLAN
========================================================= */

const generateWealthPlan = asyncHandler(async (req, res) => {
  const plan = await generateWealthPlanService(req.user._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      { wealthPlan: plan },
      "Wealth plan generated successfully."
    )
  );
});

/* =========================================================
   GET WEALTH PLAN
========================================================= */

const getWealthPlan = asyncHandler(async (req, res) => {
  const plan = await getWealthPlanService(req.user._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      { wealthPlan: plan },
      "Wealth plan fetched successfully."
    )
  );
});

const WealthProfile = require('../models/WealthProfile');
const WealthPlan = require('../models/WealthPlan');

/* =========================================================
   RESET WEALTH PROFILE
========================================================= */
const resetWealthProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  await WealthProfile.deleteMany({ user: userId });
  await WealthPlan.deleteMany({ user: userId });

  return res.status(200).json(
    new ApiResponse(200, null, "Wealth profile reset successfully.")
  );
});

module.exports = {
  saveWealthProfile,
  getWealthProfile,
  getWealthAnalysis,
  generateWealthPlan,
  getWealthPlan,
  resetWealthProfile,
};

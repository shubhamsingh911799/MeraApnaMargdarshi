const asyncHandler = require("../middleware/asyncHandler");

const {
  generateHealthPlanService,
  getHealthPlanService,
} = require("../services/healthPlanService");

const ApiResponse = require("../utils/ApiResponse");

/* =========================================================
   GENERATE HEALTH PLAN
========================================================= */

const generateHealthPlan = asyncHandler(async (req, res) => {

  const healthPlan =
    await generateHealthPlanService(
      req.user._id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      healthPlan,
      "Personalized health plan created successfully."
    )
  );

});

/* =========================================================
   GET HEALTH PLAN
========================================================= */

const getHealthPlan = asyncHandler(async (req, res) => {

  const healthPlan =
    await getHealthPlanService(
      req.user._id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      healthPlan,
      "Health plan fetched successfully."
    )
  );

});

module.exports = {
  generateHealthPlan,
  getHealthPlan,
};
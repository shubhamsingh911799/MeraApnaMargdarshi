const asyncHandler = require("../middleware/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const {
    saveHealthProfileService,
    getHealthProfileService,
    getHealthAnalysisService,
} = require("../services/healthService");



/* =========================================================
   SAVE HEALTH PROFILE
========================================================= */

const saveHealthProfile = asyncHandler(async (req, res) => {

    const profile =
        await saveHealthProfileService(
            req.user._id,
            req.body
        );


    return res.status(200).json(

        new ApiResponse(

            200,

            { healthProfile: profile },

            "Health profile saved successfully."

        )

    );

});




/* =========================================================
   GET HEALTH PROFILE
========================================================= */

const getHealthProfile = asyncHandler(async (req, res) => {

    const profile =
        await getHealthProfileService(
            req.user._id
        );


    return res.status(200).json(

        new ApiResponse(

            200,

            { healthProfile: profile },

            "Health profile fetched successfully."

        )

    );

});




/* =========================================================
   GET HEALTH ANALYSIS
========================================================= */

const getHealthAnalysis = asyncHandler(async (req, res) => {

    const analysis =
        await getHealthAnalysisService(
            req.user._id
        );


    return res.status(200).json(

        new ApiResponse(

            200,

            analysis,

            "Health analysis generated successfully."

        )

    );

});




const HealthProfile = require('../models/HealthProfile');
const HealthPlan = require('../models/HealthPlan');

/* =========================================================
   RESET HEALTH PROFILE
========================================================= */
const resetHealthProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  await HealthProfile.deleteMany({ user: userId });
  await HealthPlan.deleteMany({ user: userId });

  return res.status(200).json(
    new ApiResponse(200, null, "Health profile reset successfully.")
  );
});

module.exports = {
  saveHealthProfile,
  getHealthProfile,
  getHealthAnalysis,
  resetHealthProfile,
};
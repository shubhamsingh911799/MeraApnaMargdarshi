const asyncHandler = require("../middleware/asyncHandler");

const {
  saveDayProfileService,
  getDayProfileService,
  deleteDayProfileService,
} = require("../services/dayProfileService");

const ApiResponse = require("../utils/ApiResponse");

/* =========================================================
   SAVE / UPDATE DAY PROFILE
========================================================= */

const saveDayProfile = asyncHandler(async (req, res) => {

  const dayProfile = await saveDayProfileService(
    req.user._id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      dayProfile,
      "Daily life profile saved successfully."
    )
  );

});

/* =========================================================
   GET DAY PROFILE
========================================================= */

const getDayProfile = asyncHandler(async (req, res) => {

  const dayProfile = await getDayProfileService(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      dayProfile,
      "Daily life profile fetched successfully."
    )
  );

});

/* =========================================================
   DELETE DAY PROFILE
========================================================= */

const deleteDayProfile = asyncHandler(async (req, res) => {

  await deleteDayProfileService(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Daily life profile deleted successfully."
    )
  );

});

module.exports = {
  saveDayProfile,
  getDayProfile,
  deleteDayProfile,
};
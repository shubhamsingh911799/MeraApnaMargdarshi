const asyncHandler = require("../middleware/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const {
  getDashboardService,
} = require("../services/dashboardService");

/* =========================================================
   GET DASHBOARD
========================================================= */

const getDashboard = asyncHandler(async (req, res) => {

  const dashboard = await getDashboardService(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      dashboard,
      "Dashboard fetched successfully."
    )
  );

});

module.exports = {
  getDashboard,
};
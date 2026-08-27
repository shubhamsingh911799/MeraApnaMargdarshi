const asyncHandler = require("../middleware/asyncHandler");

const {
  getTodayPlanService,
  toggleTaskService,
} = require("../services/dailyPlanService");

const ApiResponse = require("../utils/ApiResponse");



/* =========================================================
   GET TODAY PLAN
========================================================= */

const getTodayPlan = asyncHandler(
  async (req, res) => {


    const plan =
      await getTodayPlanService(

        req.user

      );



    return res.status(200).json(

      new ApiResponse(

        200,

        {
          plan,
        },

        "Today's plan fetched successfully"

      )

    );


  }
);





/* =========================================================
   TOGGLE TASK COMPLETION
========================================================= */

const toggleTask = asyncHandler(
  async (req, res) => {


    const {
      planId,
      taskId,
    } = req.params;



    const {
      completed,
    } = req.body;




    const updatedPlan =
      await toggleTaskService(

        req.user._id,

        planId,

        taskId,

        completed

      );




    return res.status(200).json(

      new ApiResponse(

        200,

        {
          plan: updatedPlan,
        },

        "Task status updated successfully"

      )

    );


  }
);





module.exports = {

  getTodayPlan,

  toggleTask,

};
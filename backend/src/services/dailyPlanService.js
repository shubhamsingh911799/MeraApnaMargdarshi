const DailyPlan = require("../models/DailyPlan");
const {
  generateDailyPlan,
} = require("./planGenerator");

const {
  getTodayDate,
} = require("../utils/dateUtils");

const ApiError = require("../utils/ApiError");


/* =========================================================
   GET TODAY PLAN
========================================================= */

const getTodayPlanService = async (
  user
) => {


  const today =
    getTodayDate();



  let plan =
    await DailyPlan.findOne({

      user: user._id,

      date: today,

    });



  if (plan) {

    return plan;

  }



  const tasks =
    generateDailyPlan({

      user,

      healthProfile: null,

      growthProfile: null,

      wealthProfile: null,

    });



  plan =
    await DailyPlan.create({

      user: user._id,

      date: today,

      tasks,


      totalTasks:
        tasks.length,


      completedTasks:
        0,


      progress:
        0,

    });



  return plan;

};





/* =========================================================
   TOGGLE TASK STATUS
========================================================= */

const toggleTaskService = async (

  userId,

  planId,

  taskId,

  completed

) => {


  const plan =
    await DailyPlan.findOne({

      _id: planId,

      user: userId,

    });



  if (!plan) {

    throw new ApiError(
      404,
      "Daily plan not found."
    );

  }




  const task =
    plan.tasks.id(taskId);



  if (!task) {

    throw new ApiError(
      404,
      "Task not found."
    );

  }



  task.completed =
    completed;



  const completedTasks =
    plan.tasks.filter(
      (task) =>
        task.completed
    ).length;



  plan.completedTasks =
    completedTasks;



  plan.totalTasks =
    plan.tasks.length;



  plan.progress =
    Math.round(
      (
        completedTasks /
        plan.totalTasks
      ) * 100
    );



  await plan.save();



  return plan;

};





module.exports = {

  getTodayPlanService,

  toggleTaskService,

};
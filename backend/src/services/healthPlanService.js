const HealthProfile = require("../models/HealthProfile");
const HealthPlan = require("../models/HealthPlan");
const ApiError = require("../utils/ApiError");


/* =========================================================
   GENERATE HEALTH PLAN
========================================================= */

const generateHealthPlanService = async (
  userId
) => {


  const healthProfile =
    await HealthProfile.findOne({
      user: userId,
    });



  if (!healthProfile) {

    throw new ApiError(
      404,
      "Complete health profile before creating plan."
    );

  }



  const goals = [

    {
      title: "Build a consistent sleep routine",

      description:
        "Maintain a consistent sleep and wake schedule.",

      priority: "high",
    },


    ...(healthProfile.activityLevel === "low" ||
healthProfile.activityLevel === "sedentary"
  ? [{
      title: "Increase daily movement",
      description:
        "Gradually increase your daily physical activity.",
      priority: "high",
    }]
  : [{
      title: "Maintain physical activity",
      description:
        "Continue your current activity routine consistently.",
      priority: "medium",
    }]),


    {
      title: "Build sustainable food habits",

      description:
        "Create realistic nutrition habits.",

      priority: "medium",
    },


    {
      title: "Improve daily consistency",

      description:
        "Focus on small improvements every day.",

      priority: "high",
    },

  ];




  const monthlyRoadmap = generateMonthlyRoadmap();



  const healthPlan =
    await HealthPlan.findOneAndUpdate(

      {
        user: userId,
      },


      {

        user: userId,

        planTitle:
          "Your Personalized Health Journey",


        durationMonths:
          12,


        currentMonth:
          1,


        goals,


        monthlyRoadmap,


        overallProgress:
          0,


        status:
          "active",

      },


      {

        new: true,

        upsert: true,

        runValidators: true,

      }

    );



  return healthPlan;

};





/* =========================================================
   GET HEALTH PLAN
========================================================= */

const getHealthPlanService = async (
  userId
) => {


  const healthPlan =
    await HealthPlan.findOne({
      user: userId,
    });



  if (!healthPlan) {

    throw new ApiError(
      404,
      "Health plan not found."
    );

  }


  return healthPlan;

};





/* =========================================================
   ROADMAP GENERATOR
========================================================= */

const generateMonthlyRoadmap = () => {


  const months = [

    "Routine Foundation",

    "Movement Foundation",

    "Nutrition Awareness",

    "Energy & Recovery",

    "Activity Progress",

    "Mid-Year Review",

    "Habit Strengthening",

    "Lifestyle Balance",

    "Long-Term Consistency",

    "Performance & Routine",

    "Sustainable Lifestyle",

    "Year-End Reflection",

  ];



  return months.map(
    (title, index) => ({

      month:
        index + 1,


      title,


      focus:
        title,


      objective:
        `Complete ${title} phase and improve consistency.`,


      milestones: [

        {

          title:
            `${title} milestone`,


          description:
            "Track progress and maintain consistency.",

        },

      ],


    })
  );


};




module.exports = {

  generateHealthPlanService,

  getHealthPlanService,

};
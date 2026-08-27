const User = require("../models/User");
const HealthProfile = require("../models/HealthProfile");
const HealthPlan = require("../models/HealthPlan");
const WealthProfile = require("../models/WealthProfile");
const WealthPlan = require("../models/WealthPlan");
const DayProfile = require("../models/DayProfile");
const DailyPlan = require("../models/DailyPlan");

const { getTodayDate } = require("../utils/dateUtils");

/* =========================================================
   DASHBOARD SUMMARY
========================================================= */

const getDashboardService = async (userId) => {

  const today = getTodayDate();

  const [

    user,

    healthProfile,

    healthPlan,

    wealthProfile,

    wealthPlan,

    dayProfile,

    dailyPlan,

  ] = await Promise.all([

    User.findById(userId).select("-password"),

    HealthProfile.findOne({
      user: userId,
    }),

    HealthPlan.findOne({
      user: userId,
    }),

    WealthProfile.findOne({
      user: userId,
    }),

    WealthPlan.findOne({
      user: userId,
    }),

    DayProfile.findOne({
      user: userId,
    }),

    DailyPlan.findOne({
      user: userId,
      date: today,
    }),

  ]);

  return {

    user,

    healthProfile,

    healthPlan,

    wealthProfile,

    wealthPlan,

    dayProfile,

    dailyPlan,

  };

};

module.exports = {
  getDashboardService,
};
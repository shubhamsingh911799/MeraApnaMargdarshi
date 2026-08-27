const DayProfile = require("../models/DayProfile");
const ApiError = require("../utils/ApiError");


/* =========================================================
   SAVE / UPDATE DAY PROFILE
========================================================= */

const saveDayProfileService = async (
  userId,
  data
) => {

  const payload = {
    ...data,
    wakeTime: data.wakeTime || "07:00",
    sleepTime: data.sleepTime || "23:00",
  };

  const dayProfile =
    await DayProfile.findOneAndUpdate(
      {
        user: userId,
      },

      {
        user: userId,
        ...payload,
      },

      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );


  return dayProfile;

};



/* =========================================================
   GET DAY PROFILE
========================================================= */

const getDayProfileService = async (
  userId
) => {


  const dayProfile =
    await DayProfile.findOne({
      user: userId,
    });


  if (!dayProfile) {

    throw new ApiError(
      404,
      "Day profile not found."
    );

  }


  return dayProfile;

};




/* =========================================================
   DELETE DAY PROFILE
========================================================= */

const deleteDayProfileService = async (
  userId
) => {


  const dayProfile =
    await DayProfile.findOneAndDelete({
      user: userId,
    });



  if (!dayProfile) {

    throw new ApiError(
      404,
      "Day profile not found."
    );

  }



  return dayProfile;

};



module.exports = {

  saveDayProfileService,

  getDayProfileService,

  deleteDayProfileService,

};
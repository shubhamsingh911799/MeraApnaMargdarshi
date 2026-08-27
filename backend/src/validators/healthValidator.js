const Joi = require("joi");



/* =========================================================
   HEALTH PROFILE VALIDATION
========================================================= */


const healthProfileSchema = Joi.object({

    age: Joi.number()
        .integer()
        .min(10)
        .max(100)
        .required(),



    height: Joi.number()
        .min(50)
        .max(250)
        .required(),



    weight: Joi.number()
        .min(10)
        .max(300)
        .required(),



    activityLevel: Joi.string()
        .trim()
        .required(),



    collegeWorkTiming: Joi.string()
        .trim()
        .allow(""),



    sleepTime: Joi.string()
        .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
        .allow("")
        .messages({

            "string.pattern.base":
            "Sleep time must be in HH:MM format"

        }),



    wakeTime: Joi.string()
        .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
        .allow("")
        .messages({

            "string.pattern.base":
            "Wake time must be in HH:MM format"

        }),



    exercise: Joi.string()
        .allow(""),



    foodPreference: Joi.string()
        .allow(""),



    healthConditions: Joi.string()
        .allow(""),


});



module.exports = {

    healthProfileSchema,

};
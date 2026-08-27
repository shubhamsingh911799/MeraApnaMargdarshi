const Joi = require("joi");

/* =========================================================
   DAY PROFILE VALIDATION
========================================================= */

const dayProfileSchema = Joi.object({
  wakeTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
    .allow("")
    .optional(),

  sleepTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
    .allow("")
    .optional(),

  collegeWork: Joi.object({
    enabled: Joi.boolean().required(),
    startTime: Joi.string().allow(""),
    endTime: Joi.string().allow(""),
  }).required(),

  commute: Joi.object({
    enabled: Joi.boolean().required(),
    durationMinutes: Joi.number().min(0).required(),
  }).required(),

  meals: Joi.object({
    breakfast: Joi.string().allow(""),
    lunch: Joi.string().allow(""),
    dinner: Joi.string().allow(""),
  }).required(),

  exercise: Joi.object({
    enabled: Joi.boolean().required(),
    preferredTime: Joi.string().allow(""),
    durationMinutes: Joi.number().min(0).required(),
  }).required(),

  studyHours: Joi.number()
    .min(0)
    .max(24)
    .required(),

  personalResponsibilities: Joi.string().allow(""),

  relaxationTime: Joi.number()
    .min(0)
    .required(),

  fixedCommitments: Joi.string().allow(""),

  flexibleTime: Joi.number()
    .min(0)
    .required(),

  weekdayType: Joi.string()
    .valid("weekday", "weekend", "both")
    .required(),
});

module.exports = {
  dayProfileSchema,
};
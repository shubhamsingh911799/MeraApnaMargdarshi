const Joi = require("joi");
const {
  TASK_CATEGORIES,
  TASK_PRIORITIES,
} = require("../constants/dailyPlanConstants");

const taskSchema = Joi.object({
  title: Joi.string().trim().max(150).required(),

  category: Joi.string()
    .valid(...TASK_CATEGORIES)
    .required(),

  priority: Joi.string()
    .valid(...TASK_PRIORITIES)
    .default("Medium"),

  estimatedMinutes: Joi.number()
    .min(0)
    .max(1440)
    .default(30),

  completed: Joi.boolean().default(false),
});

module.exports = {
  taskSchema,
};
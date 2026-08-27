const Joi = require('joi');

const growthProfileSchema = Joi.object({
  skillRatings: Joi.object({
    communication: Joi.number().min(1).max(10).required(),
    confidence: Joi.number().min(1).max(10).required(),
    publicSpeaking: Joi.number().min(1).max(10).required(),
    timeManagement: Joi.number().min(1).max(10).required(),
    decisionMaking: Joi.number().min(1).max(10).required(),
    problemSolving: Joi.number().min(1).max(10).required(),
    leadership: Joi.number().min(1).max(10).required(),
    teamwork: Joi.number().min(1).max(10).required(),
    discipline: Joi.number().min(1).max(10).required(),
    focus: Joi.number().min(1).max(10).required(),
    emotionalControl: Joi.number().min(1).max(10).required(),
    consistency: Joi.number().min(1).max(10).required(),
  }).required(),

  goals: Joi.array().items(Joi.string()).min(1).required(),
  challenges: Joi.array().items(Joi.string()).allow(null, ''),
  customGoal: Joi.string().allow(''),
  availableTimeMinutes: Joi.number().min(15).max(180).required(),
  learningPreferences: Joi.array().items(Joi.string()).min(1).required(),
  currentContext: Joi.string().required(),
  primaryFocus: Joi.string().allow(''),
});

const reflectionSchema = Joi.object({
  weekNumber: Joi.number().min(1).max(52).optional(),
  wentWell: Joi.string().allow(''),
  difficult: Joi.string().allow(''),
  learnings: Joi.string().allow(''),
  nextWeekImprovement: Joi.string().allow(''),
  confidenceRating: Joi.number().min(1).max(10).required(),
  consistencyRating: Joi.number().min(1).max(10).required(),
});

module.exports = {
  growthProfileSchema,
  reflectionSchema,
};

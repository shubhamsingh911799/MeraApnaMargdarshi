const mongoose = require('mongoose');

const GrowthTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['Practice', 'Reflection', 'Challenge', 'Habit', 'Learning', 'Social', 'Decision', 'Leadership'],
      default: 'Practice',
    },
    skill: { type: String, required: true },
    durationMinutes: { type: Number, default: 15 },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const GrowthHabitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  skill: { type: String },
  streak: { type: Number, default: 0 },
  completedToday: { type: Boolean, default: false },
});

const GrowthWeekSchema = new mongoose.Schema({
  week: { type: Number, required: true },
  title: { type: String, required: true },
  objective: { type: String, required: true },
  tasks: [GrowthTaskSchema],
});

const GrowthMonthSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  title: { type: String, required: true },
  objective: { type: String, required: true },
  primaryGoal: { type: String, required: true },
  supportingGoals: [{ type: String }],
  skills: [{ type: String }],
  target: { type: String },
  habits: [GrowthHabitSchema],
  weeks: [GrowthWeekSchema],
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
});

const WeeklyReflectionSchema = new mongoose.Schema(
  {
    weekNumber: { type: Number, default: 1 },
    wentWell: { type: String, default: '' },
    difficult: { type: String, default: '' },
    learnings: { type: String, default: '' },
    nextWeekImprovement: { type: String, default: '' },
    confidenceRating: { type: Number, min: 1, max: 10, default: 5 },
    consistencyRating: { type: Number, min: 1, max: 10, default: 5 },
  },
  { timestamps: true }
);

const GrowthProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    skillRatings: {
      communication: { type: Number, min: 1, max: 10, required: true },
      confidence: { type: Number, min: 1, max: 10, required: true },
      publicSpeaking: { type: Number, min: 1, max: 10, required: true },
      timeManagement: { type: Number, min: 1, max: 10, required: true },
      decisionMaking: { type: Number, min: 1, max: 10, required: true },
      problemSolving: { type: Number, min: 1, max: 10, required: true },
      leadership: { type: Number, min: 1, max: 10, required: true },
      teamwork: { type: Number, min: 1, max: 10, required: true },
      discipline: { type: Number, min: 1, max: 10, required: true },
      focus: { type: Number, min: 1, max: 10, required: true },
      emotionalControl: { type: Number, min: 1, max: 10, required: true },
      consistency: { type: Number, min: 1, max: 10, required: true },
    },

    goals: [{ type: String }],
    challenges: [{ type: String }],
    customGoal: { type: String, default: '' },
    availableTimeMinutes: { type: Number, default: 30 },
    learningPreferences: [{ type: String }],
    currentContext: { type: String, default: 'Student' },
    primaryFocus: { type: String, default: 'Confidence' },

    growthStage: {
      type: String,
      enum: ['Starting', 'Developing', 'Building', 'Growing', 'Strong', 'Advanced'],
      default: 'Building',
    },

    overallScore: { type: Number, default: 40 },
    strengths: [{ type: String }],

    priorities: [
      {
        skill: { type: String },
        currentLevel: { type: Number },
        targetLevel: { type: Number },
        reason: { type: String },
      },
    ],

    roadmap: [GrowthMonthSchema],
    dailyTasks: [GrowthTaskSchema],
    weeklyReflections: [WeeklyReflectionSchema],

    activeStreak: { type: Number, default: 1 },
    daysActive: { type: Number, default: 1 },
    lastActiveDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('GrowthProfile', GrowthProfileSchema);

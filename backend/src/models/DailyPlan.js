const mongoose = require("mongoose");

// ==========================================
// CONSTANTS
// ==========================================
const {
  TASK_CATEGORIES,
  TASK_PRIORITIES,
} = require("../constants/dailyPlanConstants");


// ==========================================
// TASK SCHEMA
// ==========================================

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: 150,
    },

    category: {
      type: String,
      enum: TASK_CATEGORIES,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: "Medium",
    },

    estimatedMinutes: {
      type: Number,
      default: 30,
      min: 0,
      max: 1440,
    },
  },
  {
    _id: true,
    versionKey: false,
  }
);

// ==========================================
// DAILY PLAN SCHEMA
// ==========================================

const dailyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: String,
      required: true,
      index: true,
    },

    tasks: {
      type: [taskSchema],
      default: [],
    },

    completedTasks: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalTasks: {
      type: Number,
      default: 0,
      min: 0,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// ==========================================
// INDEXES
// ==========================================

// One Daily Plan per user per day
dailyPlanSchema.index(
  { user: 1, date: 1 },
  { unique: true }
);

// ==========================================
// VIRTUALS
// ==========================================

dailyPlanSchema.virtual("remainingTasks").get(function () {
  return this.totalTasks - this.completedTasks;
});

// ==========================================
// EXPORT
// ==========================================

module.exports = mongoose.model(
  "DailyPlan",
  dailyPlanSchema
);
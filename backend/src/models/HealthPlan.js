const mongoose = require('mongoose');

const healthPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    planTitle: {
      type: String,
      default: 'Your Personalized Health Journey',
    },

    durationMonths: {
      type: Number,
      default: 12,
    },

    currentMonth: {
      type: Number,
      default: 1,
    },

    goals: [
      {
        title: String,
        description: String,
        priority: {
          type: String,
          enum: ['low', 'medium', 'high'],
          default: 'medium',
        },
      },
    ],

    monthlyRoadmap: [
      {
        month: {
          type: Number,
          required: true,
        },

        title: String,

        focus: String,

        objective: String,

        milestones: [
          {
            title: String,
            description: String,
          },
        ],

        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    overallProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HealthPlan', healthPlanSchema);
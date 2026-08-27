const mongoose = require('mongoose');

const wealthPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    planTitle: {
      type: String,
      default: '12-Month Financial Mastery Roadmap',
    },

    durationMonths: {
      type: Number,
      default: 12,
    },

    financialHealthScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },

    monthlySavingsTarget: {
      type: Number,
      default: 0,
    },

    emergencyFundTarget: {
      type: Number,
      default: 0,
    },

    budgetRule: {
      needsPercent: { type: Number, default: 50 },
      wantsPercent: { type: Number, default: 30 },
      savingsPercent: { type: Number, default: 20 },
    },

    investmentAllocation: {
      lowRiskPercent: { type: Number, default: 40 },
      moderateRiskPercent: { type: Number, default: 40 },
      highRiskPercent: { type: Number, default: 20 },
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

module.exports = mongoose.model('WealthPlan', wealthPlanSchema);

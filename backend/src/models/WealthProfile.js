const mongoose = require('mongoose');

const wealthProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    monthlyIncome: {
      type: Number,
      required: true,
      min: 0,
    },

    incomeSources: {
      type: String,
      default: 'Salary / Primary Employment',
    },

    fixedExpenses: {
      type: Number,
      required: true,
      min: 0,
    },

    variableExpenses: {
      type: Number,
      required: true,
      min: 0,
    },

    currentSavings: {
      type: Number,
      required: true,
      min: 0,
    },

    currentInvestments: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalDebt: {
      type: Number,
      default: 0,
      min: 0,
    },

    riskTolerance: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
      default: 'Moderate',
    },

    primaryGoal: {
      type: String,
      required: true,
      default: 'Wealth Building',
    },

    targetEmergencyFundMonths: {
      type: Number,
      default: 6,
      min: 1,
      max: 24,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WealthProfile', wealthProfileSchema);

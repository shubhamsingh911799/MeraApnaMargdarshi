const mongoose = require('mongoose');

const healthProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    age: {
      type: Number,
      required: true,
    },

    height: {
      type: Number,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    activityLevel: {
      type: String,
      required: true,
    },

    collegeWorkTiming: {
      type: String,
      required: true,
    },

    sleepTime: {
      type: String,
      required: true,
    },

    wakeTime: {
      type: String,
      required: true,
    },

    exercise: {
      type: String,
      default: '',
    },

    foodPreference: {
      type: String,
      required: true,
    },

    healthConditions: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HealthProfile', healthProfileSchema);
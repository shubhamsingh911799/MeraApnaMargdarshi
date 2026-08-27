const mongoose = require('mongoose');

const DayProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    wakeTime: {
      type: String,
      required: true,
    },

    sleepTime: {
      type: String,
      required: true,
    },

    collegeWork: {
      enabled: {
        type: Boolean,
        default: false,
      },
      startTime: String,
      endTime: String,
    },

    commute: {
      enabled: {
        type: Boolean,
        default: false,
      },
      durationMinutes: {
        type: Number,
        default: 0,
      },
    },

    meals: {
      breakfast: String,
      lunch: String,
      dinner: String,
    },

    exercise: {
      enabled: {
        type: Boolean,
        default: false,
      },
      preferredTime: String,
      durationMinutes: {
        type: Number,
        default: 0,
      },
    },

    studyHours: {
      type: Number,
      default: 0,
    },

    personalResponsibilities: {
      type: String,
      default: '',
    },

    relaxationTime: {
      type: Number,
      default: 0,
    },

    fixedCommitments: {
      type: String,
      default: '',
    },

    flexibleTime: {
      type: Number,
      default: 0,
    },

    weekdayType: {
      type: String,
      enum: ['weekday', 'weekend', 'both'],
      default: 'both',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DayProfile', DayProfileSchema);
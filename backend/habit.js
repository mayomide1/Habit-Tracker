const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    habit: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastCompleted: {
      type: String,
      default: null,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

module.exports = mongoose.model('Habit', habitSchema);
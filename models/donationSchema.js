const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const supportEventSchema = new mongoose.Schema({
  organizer: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  donationProtected: {
    type: Boolean,
    default: true
  },
  inMemoryOf: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  donations: [donationSchema],
  wordsOfSupport: [{
    supporterName: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    donationAmount: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

const SupportEvent = mongoose.model('SupportEvent', supportEventSchema);

module.exports = SupportEvent;

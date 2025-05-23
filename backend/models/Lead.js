const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: {
    type: String,
    unique: true,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v); // Simple 10-digit phone number validation
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  notes: [{
    date: {
      type: Date,
      default: Date.now
    },
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['email', 'call', 'meeting', 'other'],
      required: true
    },
    followUp: {
      type: Date
    }
  }],

  emails: [{
    to: {
      type: String, required: true
    },
    subject: {
      type: String, required: true
    },
    text: {
      type: String, required: true
    },
    sentAt: {
      type: Date,   default: Date.now
    },
  }],

  company: { type: String, required: true },
  linkedIn: { type: String, required: true },
  status: { type: String, default: 'new' },
  tags: [String],
 


}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);

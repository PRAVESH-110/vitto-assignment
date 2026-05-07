const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    businessProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusinessProfile',
      required: true,
    },
    loanAmount: {
      type: Number,
      required: true,
      min: [1000, 'Loan amount must be at least 1000'],
    },
    tenure: {
      type: Number, // in months
      required: true,
      min: [1, 'Tenure must be at least 1 month'],
    },
    loanPurpose: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
    },
    decisionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Decision',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);

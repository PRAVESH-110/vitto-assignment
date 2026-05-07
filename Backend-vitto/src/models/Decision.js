const mongoose = require('mongoose');

const decisionSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    status: {
      type: String,
      enum: ['APPROVED', 'APPROVED_WITH_WARNINGS', 'REJECTED'],
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 300,
      max: 900,
    },
    reasonCodes: [
      {
        type: String,
      },
    ],
    riskSummary: {
      type: String,
    },
    engineSignals: {
      type: mongoose.Schema.Types.Mixed, // stores raw calculation signals
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Decision', decisionSchema);

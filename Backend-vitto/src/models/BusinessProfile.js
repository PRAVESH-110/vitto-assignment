const mongoose = require('mongoose');

const businessProfileSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    pan: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'],
    },
    businessType: {
      type: String,
      required: true,
      enum: ['Proprietorship', 'Partnership', 'LLP', 'Private Limited', 'Public Limited', 'Other'],
    },
    monthlyRevenue: {
      type: Number,
      required: true,
      min: [0, 'Revenue cannot be negative'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BusinessProfile', businessProfileSchema);

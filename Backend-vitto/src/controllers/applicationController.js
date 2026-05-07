const BusinessProfile = require('../models/BusinessProfile');
const Application = require('../models/Application');
const Decision = require('../models/Decision');
const AuditLog = require('../models/AuditLog');
const { runDecisionEngine } = require('../services/decisionEngine');
const asyncWrapper = require('../utils/asyncWrapper');
const { sendSuccess } = require('../utils/response');

/**
 * @desc Create an application and process decision
 * @route POST /api/applications
 * @access Public
 */
const createApplication = asyncWrapper(async (req, res) => {
  const {
    ownerName,
    pan,
    businessType,
    monthlyRevenue,
    loanAmount,
    tenure,
    loanPurpose,
  } = req.body;

  // 1. Create Business Profile
  let businessProfile = await BusinessProfile.findOne({ pan });
  if (!businessProfile) {
    businessProfile = await BusinessProfile.create({
      ownerName,
      pan,
      businessType,
      monthlyRevenue,
    });
  } else {
    // Update existing profile with new monthly revenue/type
    businessProfile.monthlyRevenue = monthlyRevenue;
    businessProfile.businessType = businessType;
    businessProfile.ownerName = ownerName;
    await businessProfile.save();
  }

  // 2. Create Application
  const application = await Application.create({
    businessProfileId: businessProfile._id,
    loanAmount,
    tenure,
    loanPurpose,
    status: 'PROCESSING',
  });

  // Log creation
  await AuditLog.create({
    applicationId: application._id,
    action: 'APPLICATION_CREATED',
    details: { loanAmount, tenure },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  // 3. Run Decision Engine
  const businessData = { monthlyRevenue, pan };
  const loanData = { loanAmount, tenure };
  
  const decisionResult = runDecisionEngine(businessData, loanData);

  // 4. Save Decision
  const decision = await Decision.create({
    applicationId: application._id,
    status: decisionResult.status,
    score: decisionResult.score,
    reasonCodes: decisionResult.reasonCodes,
    riskSummary: decisionResult.riskSummary,
    engineSignals: decisionResult.engineSignals,
  });

  // 5. Update Application Status
  application.status = decisionResult.status === 'REJECTED' ? 'FAILED' : 'COMPLETED';
  application.decisionId = decision._id;
  await application.save();

  // Log decision
  await AuditLog.create({
    applicationId: application._id,
    action: 'DECISION_PROCESSED',
    details: { status: decisionResult.status, score: decisionResult.score },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return sendSuccess(res, 201, 'Application processed successfully', {
    applicationId: application._id,
    status: decisionResult.status,
    score: decisionResult.score,
    reasonCodes: decisionResult.reasonCodes,
    riskSummary: decisionResult.riskSummary,
  });
});

/**
 * @desc Get application details
 * @route GET /api/applications/:id
 * @access Public
 */
const getApplication = asyncWrapper(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('businessProfileId')
    .populate('decisionId');

  if (!application) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }

  return sendSuccess(res, 200, 'Application retrieved successfully', application);
});

module.exports = {
  createApplication,
  getApplication,
};

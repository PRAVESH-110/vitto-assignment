/**
 * Lending Decision Engine
 * Evaluates business profile and loan data to determine credit risk.
 */

const BASE_SCORE = 650;

/**
 * Validates basic logic for fraud/inconsistencies.
 */
const validateData = (businessData, loanData) => {
  const reasonCodes = [];

  // Malformed PAN
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(businessData.pan)) {
    reasonCodes.push('INVALID_PAN');
  }

  if (businessData.monthlyRevenue <= 0 || loanData.loanAmount <= 0 || loanData.tenure <= 0) {
    reasonCodes.push('DATA_INCONSISTENCY');
  }

  // Unrealistic loan vs revenue (e.g., loan > 100x monthly revenue)
  if (loanData.loanAmount > businessData.monthlyRevenue * 100) {
    reasonCodes.push('UNREALISTIC_LOAN_AMOUNT');
  }

  return reasonCodes;
};

/**
 * Calculates risk signals and modifies base score.
 */
const calculateRisk = (businessData, loanData) => {
  let score = BASE_SCORE;
  const reasonCodes = [];
  const signals = {};

  const { monthlyRevenue } = businessData;
  const { loanAmount, tenure } = loanData;

  // 1. Revenue-to-EMI ratio
  const emi = loanAmount / tenure;
  const revenueToEmiRatio = monthlyRevenue / emi;
  signals.revenueToEmiRatio = revenueToEmiRatio;

  if (revenueToEmiRatio > 8) {
    score += 100; // Strong positive
  } else if (revenueToEmiRatio >= 4 && revenueToEmiRatio <= 8) {
    score += 50; // Acceptable
  } else {
    score -= 100; // Risky
    reasonCodes.push('LOW_REVENUE_TO_EMI_RATIO');
  }

  // 2. Loan-to-revenue ratio
  const loanToRevenueRatio = loanAmount / monthlyRevenue;
  signals.loanToRevenueRatio = loanToRevenueRatio;

  if (loanToRevenueRatio < 3) {
    score += 50; // Healthy
  } else if (loanToRevenueRatio >= 3 && loanToRevenueRatio <= 6) {
    score -= 20; // Medium risk
    reasonCodes.push('MEDIUM_LOAN_RATIO');
  } else {
    score -= 100; // High risk
    reasonCodes.push('HIGH_LOAN_RATIO');
  }

  // 3. Tenure risk
  signals.tenure = tenure;
  if (tenure < 6) {
    score -= 50;
    reasonCodes.push('SHORT_TENURE_RISK');
  } else if (tenure > 48) {
    score -= 50;
    reasonCodes.push('LONG_TENURE_RISK');
  } else {
    score += 30; // Preferred 12-36
  }

  // Cap score between 300 and 900
  score = Math.max(300, Math.min(900, score));

  return { score, reasonCodes, signals };
};

/**
 * Executes the decision logic.
 */
const runDecisionEngine = (businessData, loanData) => {
  const initialReasonCodes = validateData(businessData, loanData);

  if (initialReasonCodes.length > 0) {
    // Immediate rejection if fraud/inconsistency is found
    return {
      status: 'REJECTED',
      score: 300, // Lowest possible score
      reasonCodes: initialReasonCodes,
      riskSummary: 'Application rejected due to data inconsistencies or validation failures.',
      engineSignals: {},
    };
  }

  const { score, reasonCodes, signals } = calculateRisk(businessData, loanData);

  let status;
  let riskSummary;

  if (score >= 700) {
    status = 'APPROVED';
    riskSummary = 'Low risk. Strong financial indicators.';
  } else if (score >= 600 && score < 700) {
    status = 'APPROVED_WITH_WARNINGS';
    riskSummary = 'Moderate risk. Acceptable financial indicators but some warnings present.';
  } else {
    status = 'REJECTED';
    riskSummary = 'High risk. Financial indicators do not meet the minimum requirements.';
  }

  return {
    status,
    score,
    reasonCodes,
    riskSummary,
    engineSignals: signals,
  };
};

module.exports = { runDecisionEngine };

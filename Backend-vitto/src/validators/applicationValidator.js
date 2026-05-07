const { check, validationResult } = require('express-validator');

const applicationValidationRules = () => {
  return [
    check('ownerName').notEmpty().withMessage('Owner name is required').trim(),
    check('pan')
      .notEmpty()
      .withMessage('PAN is required')
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
      .withMessage('Invalid PAN format'),
    check('businessType')
      .notEmpty()
      .withMessage('Business type is required')
      .isIn(['Proprietorship', 'Partnership', 'LLP', 'Private Limited', 'Public Limited', 'Other'])
      .withMessage('Invalid business type'),
    check('monthlyRevenue')
      .isFloat({ gt: 0 })
      .withMessage('Monthly revenue must be a positive number'),
    check('loanAmount')
      .isFloat({ gt: 0 })
      .withMessage('Loan amount must be a positive number'),
    check('tenure')
      .isInt({ gt: 0 })
      .withMessage('Tenure must be a positive integer'),
    check('loanPurpose').notEmpty().withMessage('Loan purpose is required').trim(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    success: false,
    message: 'Validation failed',
    errors: extractedErrors,
  });
};

module.exports = {
  applicationValidationRules,
  validate,
};

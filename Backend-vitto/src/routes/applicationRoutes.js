const express = require('express');
const { createApplication, getApplication } = require('../controllers/applicationController');
const { applicationValidationRules, validate } = require('../validators/applicationValidator');

const router = express.Router();

router.post('/', applicationValidationRules(), validate, createApplication);
router.get('/:id', getApplication);

module.exports = router;

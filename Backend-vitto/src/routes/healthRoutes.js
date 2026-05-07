const express = require('express');
const { sendSuccess } = require('../utils/response');

const router = express.Router();

router.get('/', (req, res) => {
  return sendSuccess(res, 200, 'Server is healthy', { timestamp: new Date() });
});

module.exports = router;

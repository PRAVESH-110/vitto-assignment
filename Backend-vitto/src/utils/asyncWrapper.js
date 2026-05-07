/**
 * Wrapper for async controller functions to catch errors and pass them to error handling middleware
 * @param {Function} fn - Async controller function
 * @returns {Function} - Express middleware function
 */
const asyncWrapper = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncWrapper;

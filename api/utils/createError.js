const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;

  // return error
  // return error;
};

module.exports = createError;

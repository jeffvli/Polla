const errorMessage = (code, message) => {
  return {
    error: {
      code: code,
      message: message,
    },
  };
};

module.exports = errorMessage;

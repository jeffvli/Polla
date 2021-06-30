const errorMessage = (code, message) => {
  return {
    error: {
      code: code,
      message: message.replaceAll("\n", ""),
    },
  };
};

module.exports = errorMessage;

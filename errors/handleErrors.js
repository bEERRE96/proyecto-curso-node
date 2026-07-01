const customError = ({ msg, code, status = 400 }) => {
  const error = new Error(msg);
  error.msg = msg;
  error.code = code;
  error.status = status;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, customError);
  }

  throw error;
};

export { customError };

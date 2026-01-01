//If a middleware function has 4 parameters, Express treats it as an error-handling middleware.
export const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

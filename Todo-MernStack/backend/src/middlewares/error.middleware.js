export const errorHandler = (err, req, res, next) => {
  res.json({
    status: false,
    message: err.message || "Internal Server Error",
  });
};

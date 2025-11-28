// src/utils/asyncHandler.js
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    // Use error (not err). Use .statusCode if you use ApiError pattern.
    return res.status(error?.statusCode || 500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

export { asyncHandler };

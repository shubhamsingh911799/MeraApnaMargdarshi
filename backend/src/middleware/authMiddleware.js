const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");
/**
 * ==========================================
 * Authentication Middleware
 * ==========================================
 */
const authMiddleware = asyncHandler(async (req, res, next) => {
  // Get Authorization Header
  const authHeader = req.headers.authorization;

  // Check if token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token is required.");
  }

  // Extract Token
  const token = authHeader.split(" ")[1];

  let decoded;

  // Verify Token
  try {
decoded = jwt.verify(token, config.jwtSecret);  } catch (error) {
    throw new ApiError(401, "Invalid or expired token.");
  }

  // Find User
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new ApiError(401, "User does not exist.");
  }

  // Attach authenticated user
  req.user = user;

  next();
});

module.exports = authMiddleware;
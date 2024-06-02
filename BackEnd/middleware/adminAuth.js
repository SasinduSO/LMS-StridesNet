// AdminAuth.js
const jwt = require("jsonwebtoken");
const connection = require("../models/connection");
const util = require("util");

// Load the secret key from environment variable
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const AdminAuth = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(403).json("Token is required");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.type === 'admin') {
      // If token is valid and user type is admin, allow access
      next();
    } else {
      // If user type is not admin, deny access
      res.status(403).json("You do not have permission to access this page");
    }
  } catch (err) {
    // If token is invalid or expired, deny access
    res.status(403).json("Invalid or expired token");
  }
};

module.exports = AdminAuth;

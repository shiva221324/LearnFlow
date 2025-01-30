const jwt = require("jsonwebtoken");
require("dotenv").config();

// authentication
exports.auth = async (req, res, next) => {
  try {
    // Extract token from cookies, body, or header
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    // If token is missing, return an error response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log(decoded);
      req.user = decoded; // Attach decoded token info to request object
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

//is student
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "this is protected route for  students",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "user role cannot verified,please try again",
    });
  }
};

//is admin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "this is protected route for Admin",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "user role cannot verified,please try again",
    });
  }
};

//is instructor
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "this is protected route for Instructor",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "user role cannot verified,please try again",
    });
  }
};

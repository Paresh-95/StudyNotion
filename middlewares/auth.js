const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../model/User");

//auth
exports.auth = (req, res, next) => {
  try {
    //extract token
    const token =
      req.cookie.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer", "");

    //if token missing return response
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }
    //verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Token is Invalid ",
      });
    }
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

//student
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      res.status(401).json({
        sucess: false,
        message: "Access Denied! => This is Protected Route for Student",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User Role Cannot be Verified ",
    });
  }
};

//instuctor
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.role !== "Instructor") {
      res.status(401).json({
        sucess: false,
        message: "Access Denied! => This is Protected Route for Instructor",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User Role Cannot be Verified ",
    });
  }
};

//admin

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      res.status(401).json({
        sucess: false,
        message: "Access Denied! => This is Protected Route for Admin",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User Role Cannot be Verified ",
    });
  }
};


//import the required modules
const express = require("express")
const router = express.Router();

//import the required controllers and middleware functions
const {sendOTP,signUp,login,changePassword} = require("../controllers/Auth");

const {resetPasswordToken,resetPassword} = require("../controller/ResetPassword");

const {auth} = require("../middlewares/auth")

//Routes for Login, Signup, and Authentication

//*******************************************************************************
//                          Authentication Routes
//*******************************************************************************

//Route for user login
router.post('/login',login)

//Route for user signup
router.post('/signup',signUp)

//Route for sending OTP to the user's email
router.post('/sendotp',sendOTP)

//Route for changing the password
router.post("/changePassword",auth,changePassword);



//**********************************************************************************
//                          Reset Password
//**********************************************************************************


//Route for generating a reset password token
router.post("/reset-password-token",resetPasswordToken)


//Route for resetting a user's password after verification
router.post("/reset-password",resetPassword)

//exports the router for in the main application    
module.exports = router;
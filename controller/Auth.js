const User = require("../model/User");
const OTP = require("../model/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
//sendotp

exports.sendOTP = async (req, res) => {
  try {
    //fetch email from req body
    const { email } = req.body;

    //check email/user already registered

    const checkUserPresent = await User.find({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User Already Registered ",
      });
    }

    //generate otp

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp Generated: ", otp);

    //check unique otp or not

    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: otp });
    }

    //create otp payload

    const otpPayload = { email, otp };

    //create an entry in db
    const otpBody = OTP.create(otpPayload);
    console.log(otpBody);

    //send response

    res.status(200).json({
      success: true,
      message: "OTP send Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//signup

exports.signUp = async (req, res) => {
  try {
    //data fetch from req body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validate data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "Fill All Fields",
      });
    }

    //2 password match
    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: "Passwords do not match, plz try again",
      });
    }

    //user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    //find most recent otp for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    //validate otp
    if (recentOtp.length == 0) {
      //didnt get otp
      return res.status(400).json({
        success: false,
        message: "otp not found in db",
      });
    } else if (otp !== recentOtp.otp) {
      //invalid otp entered
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create entry in db
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      accountType,
      password: hashedPassword,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/8.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    //send response
    return res.status(200).json({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    //catch if error occur
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be Registered,Plz Try Again",
    });
  }
};

//login

exports.login = async (res, res) => {
  try {
    //get data from reqbody
    const { email, password } = req.body;
    //validation on data
    if (!email || !password) {
      res.status(500).json({
        success: false,
        message: "Fill All Fields",
      });
    }
    //check for user exist in db or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      res.status(500).json({
        success: false,
        message: "User not found Plz Sign Up First",
      });
    }
    //match password
    //generate jwt token for user
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user.id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      //create cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged In Successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is Incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login failure plz try again",
    });
  }
};

//changepassword

exports.changePassword = async (req, res) => {
  try {
    //get data from req body
    //data =  oldpassword, newpassword,confirm newpassword
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    //validation - password match or not , empty or what
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      res.status(500).json({
        success: false,
        message: "Fill All 3 Fields",
      });
    }
    if (newPassword !== confirmNewPassword) {
      res.status(400).json({
        success: false,
        message: "Passwords do not match, plz try again",
      });
    }
    //update if(old password match then update the password)
    const user = await User.findOne({ email });

    if (await bcrypt.compare(oldPassword, user.password)) {
      //hash password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      //update the password
      const updatedDBPassword = await User.updateOne({
        password: hashedPassword,
      });

      //send mail of change password
      let changePasswordMailResponse = await mailSender(
        user.email,
        "Password Changed Successfully",
        `<h1>Password For your ${email} changed Successfully</h1> `
      );

      //return response
      res.status(200).json({
        success: false,
        message: "Password Changed Succcessfully",
      });
    } else {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Old Password do not match",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot change Password Plz Try again",
    });
  }
};

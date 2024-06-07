const User = require("../model/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//resetPassword token

exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req body
    const email = req.body.email;
    //check user for this email valiadation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: "Your Email is Not Registered with us",
      });
    }
    //generate token
    const token = crypto.randomUUID();
    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );

    //create url
    const url = `http://localhost:3000/updatePassword/${token}`;
    //send mail containing the url
    await mailSender(
      email,
      "Password Reset Link",
      `<h1>Password Reset Link: </h2><br><a>${url}</a>`
    );
    //return response
    return res.json({
      success: true,
      message:
        "Reset Password Email Send Succesfully Plz Check Email and Change Password",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reseting Password",
    });
  }
};

//reset Password

exports.resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body;
    //validation
    if (password != confirmPassword) {
      return res.json({
        success: false,
        message: "Password not matching",
      });
    }
    //get user details from token
    const userDetails = await User.findOne({ token: token });
    //if no entry  then invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Invalid Token",
      });
    }
    //if token time expires them invalid
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is Expired Plz Regenerate your token to reset password",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // update password
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );
    //give response
    return res.staus(200).json({
      success: true,
      message: "Password Reset Succesfull",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reseting Password",
    });
  }
};

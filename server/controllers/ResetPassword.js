const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
//reset password token link generation

exports.resetPasswordToken = async (req, res) => {
  //get email from body
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    //check user present or not
    if (!user) {
      return res.status(400).json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      });
    }
    const token = crypto.randomBytes(10).toString("hex");
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    );
    const url = `http://localhost:3000/update-password/${token}`;

    await mailSender(
      email,
      "Password Reset",
      `Your Link for email verification is ${url}. Please click this url to reset your password.`
    );

    res.json({
      success: true,
      message:
        "Email Sent Successfully, Please Check Your Email to Continue Further",
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Sending the Reset Message`,
    });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    //fetch password confirmpassword token
    let { password, confirmPassword, token } = req.body;
    // const token = req.params;
    //check both passwords equal or npt
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirmpassword are not equal please try again",
      });
    }
    confirmPassword = undefined;
    const userDetails = await User.findOne({ token: token });

    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "token invalid",
      });
    }
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired,please regenerate token",
      });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    password = undefined;
    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword },
      { new: true }
    );
    res.json({
      success: true,
      message: `Password Reset Successful`,
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    });
  }
};

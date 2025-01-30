const OTP = require("../models/OTP");
const User = require("../models/User");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpgenerator = require("otp-generator");
require("dotenv").config();
// signup
exports.signUp = async (req, res) => {
  try {
    //data fetch from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmpassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validate
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmpassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "all fields required",
      });
    }
    // check if password and confirmpassword equal or not
    if (password !== confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirmpassword are not equal please try again",
      });
    }
    // check user already exist ot not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exist",
      });
    }

    // find most recent otp
    const recentotp = await OTP.find({ email }).sort({ createdAt: -1 }); //-1 decreasing order according to createdAt value
    //validate

    if (recentotp.length === 0) {
      //otp not found
      return res.status(400).json({
        success: false,
        message: "otp not found",
      });
    } else if (otp !== recentotp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "invalid otp",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //create entry in profile
    const profileDetails = await Profile.create({
      gender: null,
      dateofBirth: null,
      about: null,
      contactNumber: null,
    });
    //create entry in user
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      //return res
      success: true,
      user,
      message: "User is registered Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User cannot be registrered. Please try again",
    });
  }
};

//login
exports.login = async (req, res) => {
  //get data from request body
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "all fields required",
      });
    }
    //chech user exist or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user not registered,please signup",
      });
    }
    // check password matched or not
    const validpassword = await bcrypt.compare(password, user.password);
    if (!validpassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }
    // user.password = undefined;
    //generate jwt token

    const playload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };
    const accesstoken = jwt.sign(playload, process.env.JWT_SECRET_KEY, {
      expiresIn: "20h",
    });
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 100),
      httpOnly: true,
    };
    // user.token = accesstoken;
    //create cookie and send response
    res.cookie("token", accesstoken, options).status(200).json({
      success: true,
      accesstoken,
      user,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure, please try again",
    });
  }
};

// send otp
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from request ki body
    const { email } = req.body;

    //chech if user already present
    const checkUserPresent = await User.findOne({ email });

    // if user already exists return response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already present",
      });
    }

    //generate otp
    var otp = otpgenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated ", otp);

    //check unique otp or not
    var result = await OTP.findOne({ otp: otp });

    if (result) {
      // Use projection to select only 'otp'
      // it returns all otps
      var listotps = await OTP.find({ otp: otp }, "otp");
      //generate otp until it is unique
      while (result) {
        otp = otpgenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        reslut = listotps.includes(otp);
      }
    }
    const otpplayload = { email, otp };

    //create an entry for otp
    const otpBody = await OTP.create(otpplayload);
    console.log(otpBody);
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (e) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//change password
exports.changePassword = async (req, res) => {};

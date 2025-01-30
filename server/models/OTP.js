const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60 * 60, // 5 hours
  },
});

async function sendVerificationEmail(email, otp) {
  try {
    //console.log(email, otp);
    const mailresponse = await mailSender(email, "Verification OTP", otp);
    // You can log or handle mailresponse here if needed
  } catch (e) {
    console.log("Error occurred while sending email", e);
    throw e;
  }
}

// Use a regular function to properly access 'this'
otpSchema.pre("save", async function (next) {
  const otpinfo = this; // 'this' refers to the OTP document being saved
  //console.log(otpinfo);
  await sendVerificationEmail(otpinfo.email, otpinfo.otp);
  next();
});

module.exports = mongoose.model("OTP", otpSchema);

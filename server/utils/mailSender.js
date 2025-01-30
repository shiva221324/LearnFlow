const nodemailer = require("nodemailer");
const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.PASS_MAIL,
      },
    });
    const mailoptions = {
      from: "StudyNotation",
      to: email,
      subject: title,
      html: body,
    };
    const info = await transporter.sendMail(mailoptions);
    // console.log(email);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = mailSender;

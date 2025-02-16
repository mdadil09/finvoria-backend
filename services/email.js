const nodemailer = require("nodemailer");

const sendEmail = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 465,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: title,
      html: body,
    });
    return info;
  } catch (error) {
    console.log(error.message);
  }
};

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await sendEmail(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: ${otp}</p>`
    );
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

module.exports = { sendEmail, sendVerificationEmail };

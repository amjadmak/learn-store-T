require('dotenv').config();
const nodemailer = require('nodemailer');

const { EMAIL_VERIFY_SUBJECT} = require('../utility/constants');

const generateUniqeUsername = (email) => {
  return `${email.split('@')[0]}_${new Date().valueOf()}`;
};

const sendEmail = async (user, tokenJson) => {

  const verificationLink = `${process.env.BASE_URL}/api/auth/verify/${user._id}/${tokenJson.token}`;

  const subject = EMAIL_VERIFY_SUBJECT;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  });

  const output =  `<div>Hello ${user.firstName}</div> <br>"أهلا بك في متجرنا" <br> <div>Please click on the following link to verify your email:</div> <br> <br> <a href="${verificationLink}">Link</a> <br> <br> <div>If you did not request this, please ignore this email.</div> <br> <br> <div>Thanks,</div> <br> <div>Learn Store</div>`;
  const outputNoVerify = `<div>Hello ${user.firstName}</div> <br>"أهلا بك في متجرنا" <br> <br> <div>Your account was created succesfully.</div> <br> <br> <div>Thanks,</div> <br> <div>Learn Store</div>`;
  const mailOptions = {
    from: `"Learn Store" <${process.env.GMAIL}>`,
    to: `"${user.firstName} ${user.lastName}" <${user.email}>`,
    subject: subject,
    text: "أهلا بك في متجرنا",
    html: tokenJson ? output : outputNoVerify,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
};
module.exports = {sendEmail, generateUniqeUsername};
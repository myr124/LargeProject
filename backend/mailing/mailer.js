
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: 'api',
    pass: process.env.SMTP_API,
  },
});



const sendVerificationEmail = async (email, firstName, url) =>{
    return transporter.sendMail({
        from: '"Breadboxd" <welcome@breadboxd.xyz>',
        to: email,
        subject: "Verify your email for Breadboxd",
        html: `<p>Hi ${firstName},</p>
               <p>Thank you for registering with Breadboxd! Please click the link below to verify your email address:</p>
               <a href="${url}">Verify Email</a>
               <p>If you did not create an account, please ignore this email.</p>
               <p>Best regards,<br/>The Breadboxd Team</p>`
    })
}

const sendForgetPasswordEmail = async (email, firstName, url) => {
  return transporter.sendMail({
    from: '"Breadboxd" <welcome@breadboxd.xyz>',
    to: email,
    subject: "Forgotten Password",
            html: `<p>Hi ${firstName},</p>
               <p>You requested to change your password. Please click the link below to change your password</p>
               <a href="${url}">Change password</a>
               <p>If you did not request to reset password, please ignore this email.</p>
               <p>Best regards,<br/>The Breadboxd Team</p>`
  })
}

module.exports = {transporter, sendVerificationEmail, sendForgetPasswordEmail};


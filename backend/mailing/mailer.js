
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

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

try {
  await transporter.verify();
  console.log("Server is ready to take our messages");
} catch (err) {
  console.error("Verification failed:", err);
}

try {
  const info = await transporter.sendMail({
    from: '"Breadboxd" <hello@breadboxd.xyz>', // sender address
    to: "rjlop2005@gmail.com", // list of recipients
    subject: "Hello", // subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // HTML body
  });

  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.error("Error while sending mail:", err);
}


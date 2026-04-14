// test-email.js
const { sendForgetPasswordEmail } = require('./mailer'); // Adjust the path if your file is named differently

async function runTest() {
  try {
    console.log("Sending test email...");
    
    // Pass in a test email, name, and a dummy URL
    const info = await sendForgetPasswordEmail(
      "rjlop2005@gmail.com", // Replace with your actual email to see it in your inbox
      "TestUser", 
      "http://localhost:5173/resetpassword"
    );

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}

runTest();
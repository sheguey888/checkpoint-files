const nodemailer = require("nodemailer");

// Create a transporter using SMTP (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-app-password",
  },
});

// Define mail options
const mailOptions = {
  from: "cheikhgueye@yopmail.com",
  to: "pauluchenna022@yopmail.com",
  subject: "Test Email from Node.js",
  text: "Hello! This email was sent using Nodemailer in Node.js.",
};

// Send the email
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
  }
});

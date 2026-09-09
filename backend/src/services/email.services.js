const nodemailer = require("nodemailer");

// transporter used to interact with SMTP servers of Google forr every gmail
// SMTP servers are the server which only sends the email.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
    console.log("Email server is ready to send messages");
  } else {
  }
});

//  Send Function
// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Finova Bank" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Registration Email
const sendRegistrationEmail = async (userEmail, name) => {
  const subject = "Welcome to Finova Bank";
  const text = `Hey! ${name}, \n\nThankyou for registering in Finova Bank. We're excited to have you on board!\nBest regards,\n\n The Finova Bank`;
  const html = `<p>Hello ${name},</p><p>Thank you for registering at Finova Bank. We're excited to have you on board!</p><p>Best regards,<br>The Finova Bank</p>`;

  await sendEmail(userEmail, subject, text, html);
};

// Login Email
const sendLoginEmail = async (userEmail, name) => {
  const subject = "New sign-in to your Finova account";
  const text = `Hello ${name}, 
  
  We noticed a new sign-in to your Finova Bank account.
  
  Login details:
   
  
  If this was you, no action is required. 
  If you don't recognize this activity, please secure your account immediately. 
  
  Best regards, 
  The Finova Bank Security Team`;


const html = `<p>Hello ${name},</p><p>Thank you for Login at Finova Bank. We're excited to have you on board!</p><p>Best regards,<br>The Finova Bank</p>`;


  await sendEmail(userEmail, subject, text, html);
};
module.exports = {
  sendRegistrationEmail,
  sendLoginEmail
};

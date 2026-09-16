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

// Send Transaction Email

const sendTransactionEmail = async (userEmail, name, amount, toAccount) => {
  try { 

    const subject = "Transaction Successful";
    const text = "Transaction Successful";
  
      const html= `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>

        <body style="margin:0; padding:0; background:#f5f7fa; font-family:Arial, sans-serif;">
          <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.08);">

            <!-- Header -->
            <div style="background:#2563eb; padding:25px; text-align:center; color:white;">
              <h1 style="margin:0; font-size:24px;">
                Transaction Successful
              </h1>
            </div>

            <!-- Content -->
            <div style="padding:30px;">
              <h2 style="margin-top:0;">
                Hello ${name},
              </h2>

              <p style="color:#555; font-size:15px; line-height:1.6;">
                Your transaction has been successfully completed.
              </p>

              <!-- Amount -->
              <div style="text-align:center; margin:25px 0;">
                <p style="margin:0; color:#777; font-size:14px;">
                  Amount Sent
                </p>

                <h1 style="margin:8px 0; color:#16a34a; font-size:32px;">
                  ₹${amount}
                </h1>
              </div>

              <!-- Transaction Details -->
              <div style="background:#f8fafc; padding:20px; border-radius:8px;">

                <p style="margin:0 0 12px;">
                  <strong>Recipient Account:</strong>
                  ${toAccount}
                </p>

                <p style="margin:0 0 12px;">
                  <strong>Status:</strong>
                  <span style="color:#16a34a;">
                    Successful
                  </span>
                </p>

                <p style="margin:0;">
                  <strong>Date:</strong>
                  ${new Date().toLocaleString("en-IN")}
                </p>

              </div>

              <p style="color:#555; font-size:14px; line-height:1.6; margin-top:25px;">
                If you did not authorize this transaction, please contact
                our support team immediately.
              </p>

              <p style="margin-top:30px;">
                Regards,<br />
                <strong>Your Company Team</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="background:#f8fafc; padding:15px; text-align:center; color:#888; font-size:12px;">
              This is an automated email. Please do not reply.
            </div>

          </div>
        </body>
        </html>
      `;
    

    await sendEmail(userEmail, subject, text, html);

    console.log("Transaction email sent successfully");
  } catch (error) {
    console.error("Error sending transaction email:", error);
  }
};
module.exports = {
  sendRegistrationEmail,
  sendLoginEmail,
  sendTransactionEmail
};

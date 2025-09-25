// import nodeMailer from "nodemailer";

// export const sendEmail = async ({ email, subject, message }) => {
//   const transporter = nodeMailer.createTransport({
//     host: process.env.SMTP_HOST,
//     service: process.env.SMTP_SERVICE,
//     port: process.env.SMTP_PORT,
//     auth: {
//       user: process.env.SMTP_MAIL,
//       pass: process.env.SMTP_PASSWORD,
//     },
//     connectionTimeout: 10000,
//   });

//   const options = {
//     from: process.env.SMTP_MAIL,
//     to: email,
//     subject,
//     html: message,
//   };
//   await transporter.sendMail(options);
// }; 


import sgMail from "@sendgrid/mail";

import dotenv from "dotenv";
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log("SendGrid API key loaded:", process.env.SENDGRID_API_KEY ? "YES" : "NO");


export const sendEmail = async ({ email, subject, message }) => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM, // must be verified in SendGrid
      subject,
      html: message,
    };

    await sgMail.send(msg);
    console.log("✅ Email sent to:", email);
  } catch (err) {
    console.error("❌ Email send failed:", err.response?.body || err.message);
  }
};

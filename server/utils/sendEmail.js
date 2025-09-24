//  import nodeMailer from "nodemailer";

// export const sendEmail = async ({ email, subject, message }) => {
//   const transporter = nodeMailer.createTransport({
//     host: process.env.SMTP_HOST,
//     service: process.env.SMTP_SERVICE,
//     port: process.env.SMTP_PORT,
//     auth: {
//       user: process.env.SMTP_MAIL,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });

//   const options = {
//     from: process.env.SMTP_MAIL,
//     to: email,
//     subject,
//     html: message,
//   };
//   await transporter.sendMail(options);
// }; 

import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodeMailer.createTransport({
      service: "gmail", // auto handles host & port
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD, // must be an App Password
      },
    });

    const options = {
      from: `"Fashion Zero" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject,
      html: message,
    };

    await transporter.sendMail(options);
    console.log("✅ Email sent successfully to:", email);
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    // Do NOT crash server
  }
};

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
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // required for port 465
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const options = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject,
      html: message,
    };

    await transporter.sendMail(options);
    console.log("✅ Email sent to:", email);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};

import nodemailer from 'nodemailer';

// Create transporter using ENV values
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', // NOTE: 'false' means insecure
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send OTP Email
export const sendOtpEmail = async (to, otp) => {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Your Real Estate verification code',
    text: `Your OTP is ${otp}. It expires in 10 minutes.`
  });

  console.log(`✅ OTP sent to ${to}`);
  console.log(`📬 Preview URL (Ethereal): ${nodemailer.getTestMessageUrl(info)}`);
};




// // utils/email.js
// import nodemailer from 'nodemailer';

// // export const transporter = nodemailer.createTransport({
// //   host: process.env.SMTP_HOST,
// //   port: +process.env.SMTP_PORT,
// //   secure: process.env.SMTP_SECURE === 'false',
// //   auth: {
// //     user: process.env.SMTP_USER,
// //     pass: process.env.SMTP_PASS
// //   }
// // });
// export const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'ruby.lesch@ethereal.email',
//         pass: 'TSqM7rqnmAGM35DGXw'
//     }
// });

// export const sendOtpEmail = async (to, otp) => {
//   await transporter.sendMail({
//     from: `"RealState" <${process.env.SMTP_FROM}>`,
//     to,
//     subject: 'Your RealState verification code',
//     text: `Your OTP is ${otp}. It expires in 10 minutes.`
//   });
// };

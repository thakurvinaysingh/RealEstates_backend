import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter;

// Development: Auto-create Ethereal account
if (process.env.NODE_ENV !== 'production') {
  const createDevTransporter = async () => {
    const testAccount = await nodemailer.createTestAccount();

    console.log('🛠 Using Ethereal test account');
    console.log(`📧 User: ${testAccount.user}`);
    console.log(`🔑 Pass: ${testAccount.pass}`);

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  };

  await createDevTransporter();

} else {
  // Production: Use real SMTP credentials from .env
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('❌ Missing SMTP configuration in environment variables.');
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export const sendOtpEmail = async (to, otp) => {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || '"RealState" <no-reply@example.com>',
    to,
    subject: 'Your Real Estate verification code',
    text: `Your OTP is ${otp}. It expires in 10 minutes.`
  });

  console.log(`✅ OTP sent to ${to}`);

  // Show preview URL in dev
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📬 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }
};


// import nodemailer from 'nodemailer';

// // Create transporter using ENV values
// export const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   secure: process.env.SMTP_SECURE === 'true', // NOTE: 'false' means insecure
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// // Send OTP Email
// export const sendOtpEmail = async (to, otp) => {
//   const info = await transporter.sendMail({
//     from: process.env.SMTP_FROM,
//     to,
//     subject: 'Your Real Estate verification code',
//     text: `Your OTP is ${otp}. It expires in 10 minutes.`
//   });

//   console.log(`✅ OTP sent to ${to}`);
//   console.log(`📬 Preview URL (Ethereal): ${nodemailer.getTestMessageUrl(info)}`);
// };




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

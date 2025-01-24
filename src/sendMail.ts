import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});



export const sendMail = async (user: string[], text: string, html: string) => {
  const mailOptions = {
    from: {
      name: "Adhan Reminder",
      address: process.env.EMAIL_USER!,
    },
    to: user,
    subject: "Reminding you to pray.",
    text,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    console.log(error.message);
  }
};

import nodemailer from "nodemailer";
export const sendEmail = async (data) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: data.email, // list of receivers
    subject: "Comfirm Forgot Password ✔", // Subject line
    html: data.html, // html body
  });
  return info;
};

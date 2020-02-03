const nodemailer = require("nodemailer");
const config = require("config");

module.exports = function sendMail(email, title, body, html) {
  //Register Mail
  async function mail() {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.get("email"), // generated ethereal user
        pass: config.get("emailPassword") // generated ethereal password
      }
    });
    const date = Date.now();
    let first = await transporter.sendMail({
      from: `"Restaurant Divaldo" <${config.get("email")}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      text: `${body}`, // plain text body
      html: `${html}` // html body
    });
  }
  mail().catch(console.error);
};

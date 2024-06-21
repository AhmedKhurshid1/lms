const nodemailer = require("nodemailer");
const {findDocument} = require('../modules/utils/queryFunctions');
const sendEmail = async (emailAddress, body, type = 'warn') => {

  const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
          user: EMAIL,
          pass: PASSWORD
      },
  });
  let { name } = await findDocument('Users', { emailAddress })
  let mailMeta = {
      warn: {
          subject: 'Warning!',
          body: `Hi ${name},\n\n${body}\n\nThank you,\n\nTeam Roam Trips.`
      },
      block: {
          subject: 'Account Blocked!',
          body: `Dear ${name},\n\n${body}.\n\nBest regards,,\n\nAdmin Roam Trips.`
      }
  }
  const mailOptions = {
      from: { address: EMAIL, name: 'Admin - Roam Trips' },
      to: emailAddress,
      subject: mailMeta[type].subject,
      text: mailMeta[type].body
  };
  await transporter.sendMail(mailOptions)

}

module.exports={sendEmail}
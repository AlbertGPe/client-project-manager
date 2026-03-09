const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "albertironhackproject@gmail.com",
    pass: process.env.MAIL_PASS,
  },
});

//TODO EMAIL TEMPLATE

module.exports.sendConfirmationEmail = (user) => {
  if (!user || !user.email) {
    console.error(
      "Cannot send confirmation email: user or user.email is undefined",
    );
    return Promise.resolve();
  }

  return transporter
    .sendMail({
      from: "Clojec Manager <albertironhackproject@gmail.com>",
      to: user.email,
      subject: "Confirm your account",
      html: `
      <h1>Welcome to Clojec Manager!</h1>
      <p>Please click the following link to confirm your account:</p>
      <a href="${process.env.API_URL}/users/${user.id}/confirm">Confirm</a>
    `,
    })
    .then((info) => {
      console.log("Confirmation email sent successfully");
      console.log("To: ", user.email);
      console.log("Message ID: ", info.messageId);
      return info;
    })
    .catch((error) => {
      console.error("Failed to send confirmation email");
      console.error("To: ", user.email);
      console.error("Error: ", error.message);


      // Return null to indicate that it failed but it's not critic
      return null;
    });
};

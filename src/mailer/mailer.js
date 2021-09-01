const nodemailer = require("nodemailer");

const user = process.env.G_USER;
const pass = process.env.G_PASS;

exports.verifyEmail = (
  { id, name, email, username, contactNumber, address, role },
  host
) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  const messageInfo = {
    to: email,
    from: user,
    subject: `WELCOME TO DORMRES!`,
    text: `
        Greetings! 😁😁
        Please check the following:

            Account ID:             ${id}
            Account Name:           ${name}
            Account Username:       ${username}
            Account Email:          ${email}
            Account Contact:        ${contactNumber}
            Account Address:        ${address}
            Account Role:           ${role}
        
        To verify your account, kindly click the link below:
            
            > http://${host}/verify-account/${id}

        Thank you for signing up! Have a nice day. 👍
    `,
  };

  transport.sendMail(messageInfo, (err, message) => {
    if (err) {
      console.log(err);
    }

    console.log(message, " Successfully sent!");
  });
};

const nodemailer = require("nodemailer");
const config = require("../config/config");

const user_email = process.env.G_USER;
const user_password = process.env.G_PASS;

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${user_email}`,
    pass: `${user_password}`,
  },
});

exports.verifyEmail = (
  { id, name, email, username, contactNumber, address, role },
  host
) => {
  const messageInfo = {
    to: email,
    from: user_email,
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

exports.changePassword = ({ id, name, email, role }, host) => {
  console.log(transport);

  const messageInfo = {
    to: email,
    from: user_email,
    subject: `WELCOME TO DORMRES!`,
    text: `
        Greetings! ${name}

        To change your account password, kindly click the link below:
        ${host}/${role}/${id}
    `,
  };

  transport.sendMail(messageInfo, (err, message) => {
    if (err) {
      console.log(err);
    }

    console.log(message, " Successfully sent!");
  });
};

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

exports.dormitoryVerifiedNotice = (userData, dormitoryData) => {
  const messageInfo = {
    to: userData.email,
    from: user_email,
    subject: `WELCOME TO DORMRES!`,
    text: `
        Greetings! ${userData.name}

        We're happy to announce that your dormitory ${dormitoryData.name} has been verified!!!
        You can now add additional information to your dormitory!!!
        
        Please be reminded that before you post your dormitory in public, Please complete all the information of your dormitory.

        Thank you!
    `,
  };

  transport.sendMail(messageInfo, (err, message) => {
    if (err) {
      console.log(err);
    }

    console.log(message, " Successfully sent!");
  });
};

exports.userVerifiedNotice = (userData) => {
  const messageInfo = {
    to: userData.email,
    from: user_email,
    subject: `WELCOME TO DORMRES!`,
    text: `
        Greetings! ${userData.name}

        We're happy to announce that your account with the role of ${userData.role} has been verified!

        Thank you!
    `,
  };

  transport.sendMail(messageInfo, (err, message) => {
    if (err) {
      console.log(err);
    }

    console.log(message, " Successfully sent!");
  });
};

exports.deniedDormitoryNotice = (dormitoryData, userData) => {
  const messageInfo = {
    to: userData.email,
    from: user_email,
    subject: `WELCOME TO DORMRES!`,
    text: `
        Greetings! ${userData.name}

        We are very sad to inform you that your dormitory ${dormitoryData.name} documents was not accepted by the admin.

        But please don't worry! Your dormitory is still in our system but not yet verified. You are still allowed to to send new documents and we
        will update your for the status of your verification.

        We hope that you understand.

        Thank you
    `,
  };

  transport.sendMail(messageInfo, (err, message) => {
    if (err) {
      console.log(err);
    }

    console.log(message, " Successfully sent!");
  });
};

exports.deniedUserNotice = (userData) => {
  const messageInfo = {
    to: userData.email,
    from: user_email,
    subject: `WELCOME TO DORMRES!`,
    text: `
        Greetings! ${userData.name}

        We are very sad to inform that our admin doesn't accept your documents as a validation for your account.

        I know this is frustrating, but still you can still send new documents to verify that your are the actual account owner.
        We want you to know that we are very happy to accept you as part of us but please meet our requirements first.

        I hope you understand our policies.
        We will be happy serving you.

        Thank you
    `,
  };

  transport.sendMail(messageInfo, (err, message) => {
    if (err) {
      console.log(err);
    }

    console.log(message, " Successfully sent!");
  });
};

exports.paymentVerificationNotice = (userData) => {
  const messageInfo = {
    to: userData.email,
    from: user_email,
    subject: `WELCOME TO DORMRES!`,
    text: `
        Greetings! ${userData.name}

        We are happy to tell you that your payment was verified by our admin!
        Enjoy your one year of activation of your dormitory! We hope your business all the best!

        Thank you fo trusting us!
    `,
  };

  transport.sendMail(messageInfo, (err, message) => {
    if (err) {
      console.log(err);
    }

    console.log(message, " Successfully sent!");
  });
};

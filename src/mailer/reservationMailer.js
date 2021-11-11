const nodemailer = require("nodemailer");
const config = require("../config/config");

const user_email = config.email;
const user_password = config.password;

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${user_email}`,
    pass: `${user_password}`,
  },
});

var title = "DORMRES";

exports.createReservationMailer = ({ email, name }) => {
  const messageInfo = {
    to: email,
    from: 'aredna',
    subject: `WELCOME TO ${title}!`,
    text: `
        Greetings!! ${name},

            Your reservation was successfully created! Kindly wait until the owner confirms your reservation.
        You will be receiving another email once your reservation was accepted.

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

exports.cancelReservationMailer = ({ email, name }) => {
  const messageInfo = {
    to: email,
    from: 'aredna',
    subject: `WELCOME TO ${title}!`,
    text: `
        Greetings!! ${name},

        Your reservation was successfully cancelled.

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

exports.addUserMailer = ({ email, name }, dormitoryData) => {
  const messageInfo = {
    to: email,
    from: 'aredna',
    subject: `WELCOME TO ${title}!`,
    text: `
        Greetings!! ${name},

        You are now a tenant of ${dormitoryData.name}!! I hope you will enjoy your stay in their property!. We hope you all the best and always be safe.

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

exports.acceptReservationMailer = ({ name, email }, dormitoryData) => {
  const messageInfo = {
    to: email,
    from: 'aredna',
    subject: `WELCOME TO ${title}!`,
    text: `
        Greetings!! ${name},

        The owner of ${dormitoryData.name} was accepted your reservation. The last step to complete your verification is to go to their property and interact with the owner for more information.

        After these, the owner will add you as their active tenants! 

        Remember to always be safe and stay healthy!

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

exports.rejectTenantReservationMailer = ({ name, email }, dormitoryData, message) => {
  const messageInfo = {
    to: email,
    from: 'aredna',
    subject: `WELCOME TO ${title}!`,
    text: `
        Greetings!! ${name},

        The owner of ${dormitoryData.name} was unfortunately rejected your reservation. They have their own reasons why they did reject your reservation but we hope that you will understand them. 

        Message from the owner of ${dormitoryData.name}:
        " ${message} "

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

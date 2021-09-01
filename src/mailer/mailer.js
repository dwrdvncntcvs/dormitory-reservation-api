const nodemailer = require("nodemailer");

exports.verifyEmail = () => {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: '',
        }
    })
};

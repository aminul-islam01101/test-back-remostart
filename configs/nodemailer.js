// node mailer configs for sending emails with gmail (googleapis/oauth2)

const { createTransport } = require('nodemailer');

// node mailer configs for sending emails with nodemailer itself

exports.sendMailWithNodeMailer = async (data,) => {
    try {
        const transporter = createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASS,
            },
        });

        const mailData = {
            from: process.env.SENDER_EMAIL, // sender address
            to: data.to, // list of receivers
            subject: data.subject,
            html: data.html,
        };

        const info = await transporter.sendMail(mailData);

        return info;
    } catch (error) {
        throw new Error('Email failure');

    
    }
};

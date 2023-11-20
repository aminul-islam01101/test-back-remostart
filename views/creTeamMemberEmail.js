
// Import the necessary modules
const nodemailer = require('nodemailer');

// Create a function to send the email
const sendEmail = async (userEmail, name, id, password) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your_email@gmail.com',
                pass: 'your_password'
            }
        });

        // Define the email content
        const mailOptions = {
            from: 'your_email@gmail.com',
            to: userEmail,
            subject: 'Welcome to our platform!',
            html: `
                <h1>Welcome to our platform, ${name}!</h1>
                <p>Dear ${name},</p>
                <p>Thank you for joining our platform. We are excited to have you on board!</p>
                <p>Your user ID is: ${id}</p>
                <p>Your password is: ${password}</p>
                <p>Please let us know if you have any questions or need any assistance.</p>
                <p>Best regards,</p>
                <p>Your Platform Team</p>
            `
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Usage example
const newUserEmail = 'new_user@example.com';
const newName = 'John Doe';
const newId = '123456';
const newPassword = 'password123';
sendEmail(newUserEmail, newName, newId, newPassword);

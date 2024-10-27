const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendValidationEmail(to, code) {
    const msg = {
        to,
        from: 'your-email@example.com', // Use a verified sender email
        subject: 'Your ViTalks Validation Code',
        text: `Your validation code is: ${code}`,
        html: `<strong>Your validation code is: ${code}</strong>`,
    };

    try {
        await sgMail.send(msg);
        console.log('Validation email sent successfully!');
    } catch (error) {
        console.error('Error sending validation email:', error);
        throw new Error('Failed to send email');
    }
}

module.exports = { sendValidationEmail };

const sgMail = require('@sendgrid/mail');
const Env = require('./env');
require('dotenv').config();

sgMail.setApiKey(Env.SENDGRID_API_KEY);

async function sendValidationEmail(to, code) {
	if (Env.SKIP_SENDING_EMAIL) {
		console.log('Skipping sending email for demonstration purposes');
        return; // Return early if skipping sending emails for demonstration purposes
	}
    const msg = {
        to,
        from: Env.SENDGRID_FROM_EMAIL, // Use a verified sender email
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

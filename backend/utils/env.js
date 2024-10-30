
// Env.js: Backend environment variables manager
require('dotenv').config({ path: '../.env' }); // Load from root .env file

const Env = {
	MONGODB_URI: process.env.REACT_APP_MONGODB_URI,
    SENDGRID_API_KEY: process.env.REACT_APP_SENDGRID_API_KEY || '',
	SENDGRID_FROM_EMAIL: process.env.REACT_APP_SENDGRID_FROM_EMAIL || 'contact@sneeit.com',
    ADMIN_EMAIL: process.env.REACT_APP_ADMIN_EMAIL || '',
	SKIP_SENDING_EMAIL: process.env.REACT_APP_SKIP_SENDING_EMAIL || true,
    BACKEND_PORT: process.env.PORT || 5001,	
};

module.exports = Env;
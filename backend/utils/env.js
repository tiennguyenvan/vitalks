
// Env.js: Backend environment variables manager
require('dotenv').config({ path: '../.env' }); // Load from root .env file

const Env = {
    ADMIN_EMAIL: process.env.REACT_APP_ADMIN_EMAIL || '',
    SENDGRID_API_KEY: process.env.REACT_APP_SENDGRID_API_KEY || '',
    BACKEND_PORT: process.env.PORT || 5001,	
	MONGODB_URI: process.env.REACT_APP_MONGODB_URI,
	SENDGRID_FROM_EMAIL: process.env.REACT_APP_SENDGRID_FROM_EMAIL || 'contact@sneeit.com',
};

module.exports = Env;
// src/Env.js: Frontend environment variables manager
class Env {
    static ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || 'nguyentien.jobs@gmail.com';
    static SERVER_URL = process.env.REACT_APP_SERVER_URL;
}

export default Env;

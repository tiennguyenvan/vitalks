# VITALKS PROJECT: Setup Instructions

## Prerequisites
1. **Node.js** installed (v16+ recommended)  
   - [Download Node.js](https://nodejs.org)  
2. **Git** installed  
   - [Download Git](https://git-scm.com/)  
3. **MongoDB Atlas** (recommended) or local MongoDB setup  
   - If local, ensure **MongoDB Community Server** is running:
     ```bash
     brew services start mongodb/brew/mongodb-community
     ```

## 1. Clone the Repository
1. Open **GitHub Desktop** > **File > Clone Repository**.
2. Select the **VITALKS_PROJECT** repo and choose a local path.
3. Or use the terminal:
   ```bash
   git clone <repository-url>
   cd VITALKS_PROJECT
   ```

## 2. Install Dependencies
1. **Backend**:
   ```bash
   cd backend
   npm install
   ```

2. **Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

## 3. Set Up MongoDB

1. **Create a `.env`** in the root folder:
   ```bash   
   touch .env
   ```
   Link the file to backend and fontend .env
   ```bash   
   ln -s ../.env backend/.env
   ln -s ../.env frontend/.env
   ```
   Now every change you make to the root env 
   will be copied to the env in the sub folder


2. **Add to `.env`**:
   ```
REACT_APP_MONGODB_URI=mongodb+srv://nguyentienjobs:YOUR_MONGO_API_KEY@dev-cluster1.99snl.mongodb.net/?retryWrites=true&w=majority&appName=dev-cluster1
REACT_APP_ADMIN_EMAIL=nguyentienjobs@gmail.com
REACT_APP_SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY
REACT_APP_SENDGRID_FROM_EMAIL=contact@sneeit.com

   ```

3. **What is `JWT_SECRET`?**
   - **JWT_SECRET** is a **private key** used to securely sign and verify **JWT tokens** (JSON Web Tokens).  
   - **Why it's important**: It ensures only valid tokens are accepted by the backend for authentication.

4. **How to Generate a Secure JWT Secret**:
   Run this command in the terminal to generate a random secret:
   ```bash
   openssl rand -base64 32
   ```

   Use the generated string as the `JWT_SECRET` in your `.env` file.

## 4. Update MongoDB Connection Logic in `db.js`
1. Ensure **Mongoose** is used to connect to MongoDB. Update `backend/config/db.js`:
   ```javascript
   require('dotenv').config();
   const mongoose = require('mongoose');

   const uri = process.env.MONGODB_URI;

   async function connectDB() {
       try {
           await mongoose.connect(uri); // No extra options needed for v4+
           console.log("Connected to MongoDB successfully!");
       } catch (error) {
           console.error("MongoDB connection failed:", error);
           process.exit(1);
       }
   }

   module.exports = { connectDB };
   ```

2. **Restart the Backend Server** after making changes:
   ```bash
   node server.js
   ```

## 5. Run the Backend Server
1. Inside **backend** folder:
   ```bash
   cd backend
   node server.js
   ```

2. You should see:
   ```
   Connected to MongoDB successfully!
   Server is running on http://localhost:5001
   ```

## 6. Run the Frontend (React)
1. Inside **frontend** folder:
   ```bash
   cd frontend
   npm start
   ```

2. Visit:
   ```
   http://localhost:3000
   ```

## 7. Test the Setup
1. Open browser/Postman and visit:
   ```
   http://localhost:5001/
   ```

2. You should see:
   ```
   Welcome to the VITALKS API!
   ```

3. **Test User Creation:**
   - Send a **POST request** to:
     ```
     POST http://localhost:5001/test-create-user
     ```
   - **Body (JSON)**:
     ```json
     {
         "username": "test_user",
         "email": "test@example.com",
         "profilePicture": "http://example.com/profile.jpg",
         "bio": "Hello world!"
     }
     ```
   - On success, you should get:
     ```json
     {
         "_id": "some_object_id",
         "username": "test_user",
         "email": "test@example.com",
         ...
     }
     ```

## 8. Troubleshooting
- **Port Already in Use Error**: Use a different port in `.env`:
  ```
  PORT=5002
  ```
- **MongoDB Connection Issues**:
  - Verify URI or start local MongoDB:
    ```bash
    brew services start mongodb-community@6.0
    ```
- **Missing Dependencies**:
  ```bash
  npm install
  ```

## 9. Git Workflow (GitHub Desktop)
1. **Create a New Branch**:  
   - **Branch > New Branch** in GitHub Desktop.  
   - Name it (e.g., `feature/login`).

2. **Make Changes and Commit**:
   - Add a message and **commit to the branch**.

3. **Push Changes**:
   - Click **Push Origin**.

4. **Create a Pull Request**:
   - Open a **pull request** on GitHub.

## 10. Team Contact Points
- **Tim Nguyen**: Lead, Full-stack, Database  
- **Diego II Pinlac**: Full-stack, UI/UX  
- **Yaolong Liu**: Frontend, Testing, Documentation

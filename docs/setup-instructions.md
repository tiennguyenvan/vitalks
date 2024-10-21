# VITALKS PROJECT: Setup Instructions

## Prerequisites
1. **Node.js** installed (v16+ recommended)  
   - [Download Node.js](https://nodejs.org)  
2. **Git** installed  
   - [Download Git](https://git-scm.com/)  
3. **MongoDB Atlas** (recommended) or local MongoDB setup

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

1. **Create a `.env`** in `backend`:
   ```bash
   touch backend/.env
   ```

2. **Add to `.env`**:
   ```
   MONGODB_URI=mongodb+srv://nguyentienjobs:WbY0FmeRbSEuwF6x@dev-cluster1.99snl.mongodb.net/?retryWrites=true&w=majority&appName=dev-cluster1
   JWT_SECRET=your_jwt_secret
   PORT=5001
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


## 4. Run the Backend Server
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

## 5. Run the Frontend (React)
1. Inside **frontend** folder:
   ```bash
   cd frontend
   npm start
   ```

2. Visit:
   ```
   http://localhost:3000
   ```

## 6. Test the Setup
1. Open browser/Postman and visit:
   ```
   http://localhost:5001/
   ```

2. You should see:
   ```
   Welcome to the VITALKS API!
   ```

## 7. Troubleshooting
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

## 8. Git Workflow (GitHub Desktop)
1. **Create a New Branch**:  
   - **Branch > New Branch** in GitHub Desktop.  
   - Name it (e.g., `feature/login`).

2. **Make Changes and Commit**:
   - Add a message and **commit to the branch**.

3. **Push Changes**:
   - Click **Push Origin**.

4. **Create a Pull Request**:
   - Open a **pull request** on GitHub.

## 9. Team Contact Points
- **Tim Nguyen**: Lead, Full-stack, Database  
- **Diego II Pinlac**: Full-stack, UI/UX  
- **Yaolong Liu**: Frontend, Testing, Documentation

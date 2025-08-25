# FTS Shop

## Project Overview

A full-stack web application for online buyers. Users can register, log in, submit orders, and view their status.

## Technologies Used

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Validation:** Joi
- **Deployment:** MongoDB Atlas (database)

## Project Setup

### Prerequisites

- Node.js and npm
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Go to the `backend` folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend server:
   ```sh
   node server.js
   ```

### Frontend Setup

1. Go to the `frontend` folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React app:
   ```sh
   npm start
   ```

## Running Locally

- Start backend (default: http://localhost:5000)
- Start frontend (default: http://localhost:3000)
- Frontend interacts with backend API for authentication and applications.

## API Documentation

/api/users/signup
/api/users/signin
/api/users/logout
/api/dashboard
/api/orders
/api/orders/:id
/api/orders/user/:userId

### Error Handling & Validation

- All endpoints validate input and return clear error messages for invalid requests.
- Protected routes require a valid JWT token in the `Authorization` header.

## Deployment

- Frontend: localhost/3000
- Backend: localhost/5000
- Database: MongoDB Atlas

---

For more details, see the source code and comments in each file.

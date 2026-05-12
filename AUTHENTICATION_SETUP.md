# Authentication Integration Setup Guide

## Overview
The backend and frontend are now fully integrated with JWT-based authentication and CORS enabled.

## Backend Setup

### 1. Environment Variables
Make sure your `.env` file in `airbnb-api/` has:
```
DATABASE_URL="postgresql://postgres:123456@localhost:5432/airbnb_db"
PORT=5000
JWT_SECRET="your_super_secret_key_change_this"
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key_here
```

### 2. Start Backend
```bash
cd airbnb-api
npm run dev
```
Backend runs on `http://localhost:5000`

## Frontend Setup

### 1. Environment Variables
Make sure your `.env` file in `airbnb-ui/` has:
```
VITE_API_URL=http://localhost:5000/api/v1
```

### 2. Start Frontend
```bash
cd airbnb-ui
npm run dev
```
Frontend runs on `http://localhost:5173`

## API Endpoints

### Authentication
- **POST** `/api/v1/auth/register` - Create new account
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123",
    "phone": "+1234567890"
  }
  ```

- **POST** `/api/v1/auth/login` - Login
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

## Features Implemented

### Backend
✅ JWT token generation and verification
✅ Password hashing with bcrypt
✅ CORS enabled for frontend
✅ Input validation with Zod
✅ Error handling

### Frontend
✅ Login page with backend integration
✅ Signup page with backend integration
✅ AuthContext for state management
✅ Token storage in localStorage
✅ Protected routes
✅ Toast notifications for feedback
✅ Loading states during API calls

## How It Works

1. **Registration Flow**
   - User fills signup form
   - Frontend validates input
   - Sends POST request to `/api/v1/auth/register`
   - Backend hashes password and creates user
   - Returns JWT token and user data
   - Frontend stores token in localStorage
   - User is redirected to dashboard

2. **Login Flow**
   - User enters email and password
   - Frontend validates input
   - Sends POST request to `/api/v1/auth/login`
   - Backend verifies credentials
   - Returns JWT token and user data
   - Frontend stores token in localStorage
   - User is redirected to dashboard

3. **Protected Routes**
   - Dashboard route checks if user is authenticated
   - If not authenticated, redirects to login
   - Token is sent in Authorization header for API calls

## CORS Configuration

The backend accepts requests from:
- `http://localhost:5173` (development frontend)
- `http://localhost:3000` (alternative port)
- `http://127.0.0.1:5173` (localhost alternative)

For production, update `FRONTEND_URL` in backend `.env`

## Token Management

- Tokens are stored in `localStorage` as `authToken`
- User data is stored in `localStorage` as `user`
- Tokens are automatically included in API requests via Authorization header
- Logout clears both token and user data

## Testing

1. Open `http://localhost:5173` in browser
2. Click "Sign up" to create account
3. Fill in all required fields
4. Click "Create Account"
5. You'll be redirected to dashboard if successful
6. Click logout to clear session
7. Try login with your credentials

## Troubleshooting

### CORS Error
- Ensure backend is running on port 5000
- Check `FRONTEND_URL` in backend `.env`
- Verify frontend is on port 5173

### Login/Signup Fails
- Check backend console for errors
- Verify database connection
- Ensure all required fields are filled

### Token Not Persisting
- Check browser localStorage
- Verify `authToken` key exists
- Check browser console for errors

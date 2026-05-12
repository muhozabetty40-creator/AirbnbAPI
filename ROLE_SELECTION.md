# Role Selection Feature

## Overview
Users can now choose their account type (Guest or Host) during signup. This determines their role in the system.

## Features Implemented

### Frontend
- **Role Selection UI** on signup page
  - Two options: Guest and Host
  - Visual selection with radio buttons
  - Highlighted selection with color change
  - Description for each role

### Backend
- Role parameter added to registration
- Role stored in database
- Role validation

## How It Works

### Signup Flow
1. User fills signup form
2. User selects account type:
   - **Guest**: Can book properties
   - **Host**: Can list properties
3. Role is sent to backend
4. Role is saved to database
5. User is logged in with their role

### Role Options
- **GUEST** (default)
  - Can browse and book properties
  - Can leave reviews
  - Can manage bookings

- **HOST**
  - Can list properties
  - Can manage listings
  - Can accept/reject bookings
  - Can view booking requests

## Files Updated

### Frontend
- `src/features/auth/pages/SignupPage.tsx` - Added role selection UI
- `src/features/auth/context/AuthContext.tsx` - Updated register to accept role
- `src/features/auth/types.ts` - Updated register signature
- `src/api.ts` - Updated register method to include role

### Backend
- `src/controllers/auth.controller.ts` - Already accepts role
- `src/validators/auth.validator.ts` - Already validates role

## API Changes

### Register Endpoint
```
POST /api/v1/auth/register

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "phone": "+1234567890",
  "role": "GUEST" or "HOST"
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "role": "GUEST"
  }
}
```

## Testing

1. **Go to signup** at `http://localhost:5173/signup`
2. **Fill form** with all required fields
3. **Select role**:
   - Click "Guest" or "Host"
   - See the selection highlight
4. **Create account**
5. **Verify role** is saved in database

## Database Schema

The User model already has a `role` field:
```prisma
model User {
  ...
  role String @default("guest")
  ...
}
```

## Future Enhancements
- Role-based dashboard
- Different features for guests vs hosts
- Role switching
- Role verification
- Host verification process

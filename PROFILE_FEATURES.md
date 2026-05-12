# New Features Implemented

## 1. Logout Button in Navbar ✅
- Added logout button in the navbar that appears when user is logged in
- Clicking logout clears authentication and redirects to login page
- Profile menu dropdown with user email and logout option

## 2. Hide Login Link After Login ✅
- Login link only shows when user is NOT authenticated
- Automatically redirects authenticated users away from login/signup pages
- Users see profile menu instead of login link

## 3. Profile Management ✅

### Frontend Features:
- **Profile Page** (`/profile`) - Protected route
- Edit profile information:
  - Full Name
  - Username
  - Email (read-only)
  - Phone Number
  - Bio
  - Avatar URL with preview
- Save changes button with loading state
- Error handling and toast notifications

### Backend Features:
- **GET /api/v1/users/profile** - Get current user's profile (requires authentication)
- **PUT /api/v1/users/profile** - Update current user's profile (requires authentication)
- Profile data persisted in database
- Automatic localStorage update after profile changes

## How to Use

### 1. Sign Up
- Go to `/signup`
- Fill in all required fields
- Click "Create Account"
- You'll be redirected to dashboard

### 2. View Profile
- Click on the profile avatar in navbar (top right)
- Click "My Profile"
- View and edit your information

### 3. Update Profile
- Go to `/profile`
- Edit any field (except email)
- Click "Save Changes"
- Changes are saved to database and localStorage

### 4. Logout
- Click on profile avatar in navbar
- Click "Logout"
- You'll be redirected to login page
- Login link reappears in navbar

## Files Created/Modified

### Frontend
- `src/shared/components/Navbar.tsx` - Updated with logout button and profile menu
- `src/pages/ProfilePage.tsx` - New profile management page
- `src/api.ts` - Added profile endpoints
- `src/App.tsx` - Added profile route

### Backend
- `src/controllers/users.controller.ts` - Added getProfile and updateProfile endpoints
- `src/routes/v1/users.routes.ts` - Added profile routes with authentication

## API Endpoints

### Profile Management
- `GET /api/v1/users/profile` - Get current user profile
- `PUT /api/v1/users/profile` - Update current user profile

### Request/Response Examples

**GET /api/v1/users/profile**
```
Headers: Authorization: Bearer <token>
Response: {
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "phone": "+1234567890",
    "bio": "I love traveling",
    "avatar": "https://example.com/avatar.jpg",
    "role": "guest",
    "createdAt": "2026-05-12T..."
  }
}
```

**PUT /api/v1/users/profile**
```
Headers: Authorization: Bearer <token>
Body: {
  "name": "Jane Doe",
  "username": "janedoe",
  "phone": "+0987654321",
  "bio": "Updated bio",
  "avatar": "https://example.com/new-avatar.jpg"
}
Response: {
  "message": "Profile updated successfully",
  "user": { ... }
}
```

## Notes
- Email cannot be changed (read-only field)
- All profile updates require authentication
- Changes are immediately reflected in localStorage
- Profile data is persisted in PostgreSQL database

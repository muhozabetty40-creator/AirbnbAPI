# Role Storage Fix - AddListingPage Access Issue

## Problem
Hosts were unable to access the AddListingPage even after logging in as a HOST, because the `role` was not being stored in the AuthContext.

## Root Cause
The AuthContext was not:
1. Storing the `role` from the user object
2. Retrieving the `role` from localStorage on app load
3. Providing the `role` in the context value

## Solution Implemented

### 1. Updated `src/features/auth/types.ts`
Added `role: string | null` to both `AuthState` and `AuthContextValue` interfaces:
```typescript
export interface AuthState {
  isAuthenticated: boolean
  email: string | null
  userId: string | null
  role: string | null  // ← ADDED
  loading: boolean
  error: string | null
}
```

### 2. Updated `src/features/auth/context/AuthContext.tsx`
- Added `role` state variable
- Retrieve role from localStorage on mount
- Store role during login
- Store role during register
- Clear role on logout
- Provide role in context value

```typescript
const [role, setRole] = useState<string | null>(null)

// On mount - retrieve from localStorage
if (token && user) {
  setRole(user.role)
}

// On login - store from response
setRole(response.user.role)

// On register - store from response
setRole(response.user.role)

// On logout - clear
setRole(null)

// In context value
value={{ 
  isAuthenticated, 
  email, 
  userId,
  role,  // ← PROVIDED
  loading,
  error,
  login, 
  register,
  logout 
}}
```

## How It Works Now

1. **User registers as HOST**
   - Backend returns `role: "HOST"` in response
   - Frontend stores it in localStorage
   - AuthContext stores it in state

2. **User logs in as HOST**
   - Backend returns `role: "HOST"` in response
   - Frontend stores it in localStorage
   - AuthContext stores it in state

3. **User navigates to `/add-listing`**
   - AddListingPage calls `useAuth()` hook
   - Gets `role` from context
   - Checks if `role === 'HOST'`
   - If yes → shows form
   - If no → shows "Access Denied" message

4. **Page refresh**
   - AuthContext checks localStorage on mount
   - Retrieves stored `role`
   - User remains authenticated with correct role

## Testing

### ✅ Test Case 1: Register as HOST
1. Go to signup page
2. Select "HOST" role
3. Complete registration
4. Navigate to `/add-listing`
5. Should see the listing form (not access denied)

### ✅ Test Case 2: Login as HOST
1. Go to login page
2. Login with HOST account
3. Navigate to `/add-listing`
4. Should see the listing form

### ✅ Test Case 3: Access from Dashboard
1. Login as HOST
2. Go to Dashboard
3. Click "Add listing" in sidebar
4. Should navigate to `/add-listing` and show form

### ✅ Test Case 4: Access from Navbar
1. Login as HOST
2. Click profile icon (top right)
3. Click "Add Listing"
4. Should navigate to `/add-listing` and show form

### ✅ Test Case 5: Guest cannot access
1. Login as GUEST
2. Try to navigate to `/add-listing`
3. Should see "Access Denied" message

## Files Modified
- `src/features/auth/types.ts` - Added role to interfaces
- `src/features/auth/context/AuthContext.tsx` - Added role state and logic

## Backend Verification
The backend was already correctly returning the role:
- `src/controllers/auth.controller.ts` - Returns role in both login and register responses
- `src/validators/auth.validator.ts` - Validates role enum (GUEST/HOST)

## Result
✅ Hosts can now access the AddListingPage
✅ Role persists across page refreshes
✅ Role-based access control works correctly
✅ Guests are properly restricted from creating listings

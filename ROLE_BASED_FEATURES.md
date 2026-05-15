# Role-Based Features Implementation

## Overview
Users can now choose their role (HOST or GUEST) during signup and access role-specific features.

## Features Implemented

### 1. Role Selection Fixed ✅
- Role is now properly saved to database
- Role is returned in login/register responses
- Role is stored in localStorage

### 2. Host Features ✅
- **Add Listing** (`/add-listing`)
  - Create new property listings
  - Set title, description, location
  - Set price per night and max guests
  - Choose property type (Apartment, House, Villa, Cabin)
  - Add amenities
  - Listings saved to database

### 3. Guest Features ✅
- **Book Listing** (`/book/:id`)
  - Select check-in and check-out dates
  - Choose number of guests
  - View total price calculation
  - Create booking
  - Bookings saved to database

### 4. Role-Based Navigation ✅
- Navbar shows role indicator (🏠 Host or 👤 Guest)
- Hosts see "Add Listing" option in profile menu
- Guests see standard profile menu

## Files Created/Updated

### Frontend
- `src/pages/AddListingPage.tsx` - Host listing creation
- `src/pages/BookingPage.tsx` - Guest booking
- `src/App.tsx` - Added routes
- `src/shared/components/Navbar.tsx` - Role-based menu
- `src/api.ts` - Added listing and booking methods

### Backend
- `src/controllers/auth.controller.ts` - Returns role in responses
- `src/validators/auth.validator.ts` - Validates role

## How to Use

### For Hosts
1. **Sign up** and select "Host" role
2. **Go to profile** (click avatar)
3. **Click "Add Listing"**
4. **Fill listing details**:
   - Title, description, location
   - Price per night, max guests
   - Property type, amenities
5. **Click "Create Listing"**
6. Listing appears on homepage

### For Guests
1. **Sign up** and select "Guest" role
2. **Browse listings** on homepage
3. **Click on a listing**
4. **Click "Book Now"** (or similar button)
5. **Fill booking details**:
   - Check-in date
   - Check-out date
   - Number of guests
6. **See total price**
7. **Click "Complete Booking"**
8. Booking is saved

## API Endpoints

### Listings
- `POST /api/v1/listings` - Create listing (Host only)
- `GET /api/v1/listings` - Get all listings
- `GET /api/v1/listings/:id` - Get listing details

### Bookings
- `POST /api/v1/bookings` - Create booking (Guest only)
- `GET /api/v1/users/:id/bookings` - Get user bookings

## Database Schema

### User Model
```prisma
model User {
  id       String
  role     String @default("guest")  // "GUEST" or "HOST"
  listings Listing[]
  bookings Booking[]
}
```

### Listing Model
```prisma
model Listing {
  id            String
  title         String
  description   String
  location      String
  pricePerNight Float
  guests        Int
  type          String
  amenities     String[]
  userId        String
  user          User
  bookings      Booking[]
}
```

### Booking Model
```prisma
model Booking {
  id        String
  userId    String
  listingId String
  checkIn   DateTime
  checkOut  DateTime
  guests    Int
  total     Float
  user      User
  listing   Listing
}
```

## Testing

### Test as Host
1. Sign up with role "Host"
2. Go to profile → "Add Listing"
3. Create a test listing
4. Verify it appears on homepage

### Test as Guest
1. Sign up with role "Guest"
2. Browse listings
3. Click on a listing
4. Book it with dates and guests
5. Verify booking is created

## Routes

### Public Routes
- `/` - Homepage (listings)
- `/login` - Login page
- `/signup` - Signup page

### Protected Routes
- `/dashboard` - User dashboard
- `/profile` - User profile
- `/add-listing` - Add listing (Host only)
- `/book/:id` - Book listing (Guest only)

## Next Steps
- Add listing management (edit/delete)
- Add booking management (cancel/confirm)
- Add reviews and ratings
- Add payment integration
- Add messaging between hosts and guests
